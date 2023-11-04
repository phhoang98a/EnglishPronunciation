"use client"

import { Progress } from "@/components/ui/progress"
import { BadgeInfo } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import styles from "../style.module.css";
export default function Result({ result }) {
  function getBgColor(word) {
    if (word.error_type === "Omission")
      return "bg-gray-500";
    else if (word.error_type === "Insertion")
      return "bg-pink-400"
    else {
      const value = parseFloat(word.accuracy_score);
      if (value >= 80) return "bg-green-500";
      if (value >= 60) return "bg-orange-500";
      return "bg-red-500";
    }
  }
  return (
    <div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              Accuracy score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BadgeInfo className="mr-2 h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 break-words">
                    <p>Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Word and full text accuracy scores are aggregated from phoneme-level accuracy score.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {result.accuracy_score}/100
          </div>
          <Progress value={result.accuracy_score} />
        </div>
        <div className="w-1/2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              Fluency score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BadgeInfo className="mr-2 h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 break-words">
                    <p>Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {result.fluency_score}/100
          </div>
          <Progress value={result.fluency_score} />
        </div>
      </div>
      <div className={styles.contentBox} style={{ marginTop: "10px" }}>
        <div className="flex flex-wrap gap-2 justify-center">
          {result.words.map((word, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <div
                  key={index}
                  className={`px-2 py-1 rounded text-white text-sm text-center w-16 ${getBgColor(word)}`}
                  style={{ textDecoration: word.error_type === "Insertion" && "line-through" }}
                >
                  {word.word}
                  {word.error_type !== "Omission" && word.error_type !== "Insertion" && <div className="text-xs mt-1">{word.accuracy_score}%</div>}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  {word.error_type=="Omission" && <p>The words that are provided in the script but are not spoken</p>}
                  {word.error_type=="Insertion" && <p>The words that are not in the script but are detected in the recording</p>}
                  {word.error_type=="Mispronunciation" && <p>The words that are spoken incorrectly</p>}
                  {word.error_type=="None" && <p>The words that are spoken correctly.Accuracy indicates how closely the phonemes match a native speaker's pronunciation</p>}
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
      <div>
        You can click on each word to check the assessment result.
      </div>
    </div>

  )
}