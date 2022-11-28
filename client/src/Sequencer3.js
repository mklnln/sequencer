import React, { useEffect } from "react";
import SequencerButton from "./SequencerButton";
import keys from "../tools/keys";
import styled from "styled-components";
import useStore from "../store";
import SequencerBPM from "./SequencerBPM";
import SequencerIsPlaying from "./SequencerIsPlaying";
import LabelText from "../styled";

const Sequencer = () => {
  const bank = useStore((state) => state.bank);
  const currentStep = useStore((state) => state.currentStep);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const sequencer = useStore((state) => state.sequencer);
  const sequencerBPM = useStore((state) => state.sequencerBPM);
  const sequencerIsPlaying = useStore((state) => state.sequencerIsPlaying);
  const turnOffSequencer = useStore((state) => state.turnOffSequencer);
  const power = useStore((state) => state.power);
  const showFocus = useStore((state) => state.showFocus);

  // this useEffect runs everytime anything in the dependency array changes, including power, step, bpm, etc
  useEffect(() => {
    const interval = setInterval(() => {
      // interval regularly updates, starts counting upon load
      // power is the power button, sequencerisplaying is play button
      if (power && sequencerIsPlaying) {
        // currentStep goes 1->16
        currentStep <= 0 || currentStep >= 16
          ? setCurrentStep(1)
          : setCurrentStep(currentStep + 1);
      }
      // ! seems like currentStep changing state informs another component to then play
    }, (1000 / sequencerBPM) * 15);
    return () => clearInterval(interval);
  }, [currentStep, setCurrentStep, sequencerBPM, sequencerIsPlaying, power]);

  const clearSequencerRow = (button) => {
    Object.keys(sequencer[button]).forEach((step) => {
      turnOffSequencer({ button: button, step: step });
    });
  };

  return (
    <SequencerOuter>
      <SequencerControls>
        <SequencerBPM />
        <SequencerIsPlaying />
      </SequencerControls>
      <SequencerRowsContainer>
        {keys.map((button) => {
          return (
            <SequencerBlock key={`sequencer-block-${button}`}>
              <SequencerRow>
                <SequencerButtonBlock>
                  {[...Array(16).keys()].map((step) => {
                    return (
                      <SequencerButton
                        key={`sequencer-${button}-${step + 1}`}
                        button={button}
                        // maybe find a function that can create a range between
                        // two arbitrary numbers instead of doing this awful hack?
                        step={step + 1}
                      />
                    );
                  })}
                </SequencerButtonBlock>
              </SequencerRow>
              <DeleteRowButton
                disabled={!power}
                onClick={() => clearSequencerRow(button)}
                className={`slider ${!showFocus && "no-outline-on-focus"}`}
              >
                <DeleteRowIcon
                  icon={faTrash}
                  className={!power && "disabled"}
                />
              </DeleteRowButton>
              <LabelText key={`sequencer-${button}`}>
                {bank.pads[button].name}
              </LabelText>
            </SequencerBlock>
          );
        })}
      </SequencerRowsContainer>
    </SequencerOuter>
  );
};

export default Sequencer;
