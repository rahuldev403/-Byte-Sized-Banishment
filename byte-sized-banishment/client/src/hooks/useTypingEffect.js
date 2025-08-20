import { useState, useEffect } from "react";

const useTypingEffect = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (i < text.length) {
          const next = prev + text[i];
          i++;
          return next;
        } else {
          clearInterval(intervalId);
          return prev;
        }
      });
    }, speed);
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};

export { useTypingEffect };
