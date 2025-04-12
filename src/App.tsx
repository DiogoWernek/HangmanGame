import { Header } from "./components/Header";
import { useEffect, useState } from "react";

import { WORDS, Challenge } from "./utils/words";

import styles from "./app.module.css";
import { Tip } from "./components/Tip/index.";
import { Letter } from "./components/Letter";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { LetterUsed, LetterUsedProps } from "./components/LetterUsed";

const ATTEMPTS_MARGIN = 5;

export default function App() {
  const [letter, setLetter] = useState("");
  const [letterUsed, setLetterUsed] = useState<LetterUsedProps[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0);

  function handleRestartGame() {
    const isConfirmed = window.confirm(
      "Você tem certeza que deseja reiniciar?"
    );

    if (isConfirmed) {
      startGame();
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const ramdomWord = WORDS[index];

    setChallenge(ramdomWord);

    setScore(0);
    setLetter("");
    setLetterUsed([]);
  }

  function handleConfirm() {
    if (!challenge) {
      return;
    }

    if (!letter.trim()) {
      return alert("Digite uma letra!");
    }

    const value = letter.toUpperCase();
    const exists = letterUsed.find(
      (used) => used.value.toUpperCase() === value
    );

    if (exists) {
      setLetter("");
      return alert("Você já utilizou a letra " + value);
    }

    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length;

    const correct = hits > 0;
    const currentScore = score + hits;

    setLetterUsed((prevState) => [...prevState, { value, correct }]);

    setScore(currentScore);
    setLetter("");
  }

  function endGame(message: string) {
    alert(message);
    startGame();
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra!");
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN;
      if (letterUsed.length === attemptLimit) {
        return endGame("Que pena, Você usou todas as tentativas!");
      }
    }, 200);
  }, [score, letterUsed.length]);

  if (!challenge) {
    return;
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={letterUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handleRestartGame}
        />

        <Tip tip={challenge.tip} />

        <div className={styles.word}>
          {challenge.word.split("").map((letter, index) => {
            const LetterUsed = letterUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            );

            return (
              <Letter
                key={index}
                value={LetterUsed?.value}
                color={LetterUsed?.correct ? "correct" : "default"}
              />
            );
          })}
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input
            autoFocus
            maxLength={1}
            value={letter}
            placeholder="?"
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LetterUsed data={letterUsed} />
      </main>
    </div>
  );
}
