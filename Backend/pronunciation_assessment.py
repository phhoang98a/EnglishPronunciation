import os

try:
    import azure.cognitiveservices.speech as speechsdk
except ImportError:
    print("""
    Importing the Speech SDK for Python failed.
    Refer to
    https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-python for
    installation instructions.
    """)
    import sys
    sys.exit(1)

from firebase_admin import credentials, storage, initialize_app

cred = credentials.Certificate("./key.json")
initialize_app(cred, {
    'storageBucket': os.getenv("BUCKET_NAME")
})

def pronunciationAssessment(blobName, text):


    source_blob_name =  blobName #"audio/record.wav"
    bucket_name = os.getenv("BUCKET_NAME")

    #The path to which the file should be downloaded
    destination_file_name = r"./audio.wav"


    bucket = storage.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    subscriptionKey = os.getenv("AZURE_KEY") # replace this with your subscription key
    region = os.getenv("AZURE_REGION") # replace this with the region corresponding to your subscription key, e.g. westus, eastasia

    speech_config = speechsdk.SpeechConfig(subscription=subscriptionKey, region=region)
    file_name = "./audio.wav"
    audio_config = speechsdk.audio.AudioConfig(filename=file_name)

    reference_text = text
    # create pronunciation assessment config, set grading system, granularity and if enable miscue based on your requirement.
    pronunciation_config = speechsdk.PronunciationAssessmentConfig(json_string="{\"GradingSystem\": \"HundredMark\", \
        \"Granularity\": \"Phoneme\", \
        \"EnableMiscue\": \"True\", \
        \"EnableProsodyAssessment\": \"True\"}"
    )
    pronunciation_config.reference_text = reference_text

    # Creates a speech recognizer using a file as audio input.
    language = 'en-US'
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, language=language, audio_config=audio_config)
    # apply pronunciation assessment config to speech recognizer
    pronunciation_config.apply_to(speech_recognizer)

    result = speech_recognizer.recognize_once_async().get()

    # Check the result
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        pronunciation_result = speechsdk.PronunciationAssessmentResult(result)
        accuracy_score, pronunciation_score, fluency_score = pronunciation_result.accuracy_score, pronunciation_result.pronunciation_score, pronunciation_result.fluency_score
        words = []
        for idx, word in enumerate(pronunciation_result.words):
            words.append({
                'word': word.word,
                'accuracy_score': word.accuracy_score,
                'error_type': word.error_type
            })

        data = {
            'accuracy_score': accuracy_score,
            'pronunciation_score':pronunciation_score,
            'fluency_score': fluency_score,
            'words': words
        }
        return data

    elif result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized")
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))

# pronunciationAssessment("audio/record.wav")