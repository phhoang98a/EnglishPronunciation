# EnglishPronunciation
**EngPronun** is an online voice recorder that checks and helps you improve your pronunciation.

![[Screenshot 2023-10-06 at 9.46.13 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%209.46.13%20PM.png?alt=media&token=6696d57a-d395-484e-b51e-c3571805f5d7&_gl=1*1l52c83*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0NzM5NC41NC4wLjA.)](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%209.36.31%20AM.png?alt=media&token=61459d67-cbbc-409e-aa95-7094519e61f4&_gl=1*rt9v8e*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEwODU1MS4xOC4xLjE2OTkxMDg3MTEuMzUuMC4w)

## Why did I build this?

As a non-native English speaker, I struggle with my pronunciation a lot. This is a tool I wished I had but could not find it anywhere, so I decided to build it myself.

## How it works?

Under the hood, **EngPronun** uses [Azure pronunciation assessment API ](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment?pivots=programming-language-python) and [Azure text to speech API ](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/index-text-to-speech)

The audio recording is done using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), and encoded into WAV format using the [WebAudioRecorder.js](https://github.com/higuma/web-audio-recorder-js) library.

## Technologies Used
- Nextjs and Shadcn with Tailwind CSS for the frontend
- Supabase for DB & Auth
- Firebase for audio storage
- Azure speech API

## Supabase Configure
- Create a new project in [Supabase dashboard ](https://supabase.com/dashboard/projects)
- Choose "SQL editor" to create sample and results table:
  ```bash
   ## create results table which save english samples
  create table sample (
    id serial primary key,
    content TEXT NOT NULL
  );

  ## Insert samples into Sample
  INSERT INTO Sample (content) VALUES
  ('The quick brown fox jumps over the lazy dog'),
  ('My Mum tries to be cool by saying that she likes all the same things that I do')

  ## create results table which save the pronunciation assessment result
  create table results (
    id serial primary key,
    email text,
    sample_id int,
    audioURL text,
    result json,
    foreign key (sample_id) references sample(id)
  );
  ```
## Env configure
   In your `/english-pronunciation/.env.local` file:

   - Fill in `NEXT_PUBLIC_SUPABASE_URL` with your project URL
   - Fill in `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key
![Screenshot 2023-11-04 at 9.36.31 AM.png](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2Fsupabase_api_key.png?alt=media&token=6717b93e-5eb3-4684-8284-812c9e72e005&_gl=1*azgrca*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEwODU1MS4xOC4xLjE2OTkxMTAzNzguNTcuMC4w)

 In your `/english-pronunciation/next.config.js` file:

   - Fill in `AZURE_KEY` with your speech service azure key
   - Fill in `AZURE_REGION` with your speech service azure region
![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%2010.13.41%20AM.png?alt=media&token=2ad1df24-9612-4fda-8ea0-f70fd3ce353f&_gl=1*bbblh1*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEwODU1MS4xOC4xLjE2OTkxMTA5NDAuNDcuMC4w)

 In your `/backend/.env` file:

   - Fill in `AZURE_KEY` with your speech service azure key
   - Fill in `AZURE_REGION` with your speech service azure region
   - Fill in `BUCKET_NAME` with your Firebase bucket name

### Start the development server

   For backend:

   ```bash
   cd Backend
   flask run
   ```

   For frontend:

   ```bash
   cd english-pronunciation
   npm install
   npm run dev
   ```
### Function
LOGIN BY MAGIC LINK

![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%201.35.54%20PM.png?alt=media&token=7748a77d-2343-4dad-a056-1e4ba9495d81&_gl=1*1ubm4wc*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEyMzA3Mi4yMC4xLjE2OTkxMjMxMjYuNi4wLjA.)

![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%201.36.16%20PM.png?alt=media&token=020fe62c-95a3-4005-b5d8-4252851d9f2b&_gl=1*1xk8nfq*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEyMzA3Mi4yMC4xLjE2OTkxMjMxNDUuNTYuMC4w)

PRONUNCIATION ASSESSMENT

- Volume icon is used to listen the sample.

- Save icon is used to save the assessment result

- Record button is used to record your speaking. 

- Stop recording button is used to stop recording

- Listen button is used to listen to your speaking.

![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%201.57.03%20PM.png?alt=media&token=16257809-ea46-412f-a5ff-5c76e5a31845&_gl=1*1f8buim*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEyMzA3Mi4yMC4xLjE2OTkxMjQyNDguNDYuMC4w)

![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%201.59.58%20PM.png?alt=media&token=124157cc-d072-4dec-bdef-22c2609c73a5&_gl=1*15cgbxm*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEyMzA3Mi4yMC4xLjE2OTkxMjQ2MzguNDguMC4w)

![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%202.05.55%20PM.png?alt=media&token=e2884fad-a43e-4508-9129-e85975b8859f&_gl=1*1pxfiql*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEyMzA3Mi4yMC4xLjE2OTkxMjQ4MDguMjUuMC4w)

![](https://firebasestorage.googleapis.com/v0/b/engpronun-d85fd.appspot.com/o/document%2FScreenshot%202023-11-04%20at%202.06.04%20PM.png?alt=media&token=4d6584cc-dddd-4e0e-8940-5e9bb2e7583f&_gl=1*oa7qx9*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5OTEyMzA3Mi4yMC4xLjE2OTkxMjQ4MjMuMTAuMC4w)
