import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";
import { US, MX, FR, DE, IT, CN, JP } from "country-flag-icons/react/3x2";
import "./EntryPage.css";
import SpeedMenu from "./SpeedMenu";
import image from "./dist/landscape.webp";

const languages = [
  { flag: US, name: "English (United States)", code: "en-US" },
  { flag: MX, name: "Spanish (Mexico)", code: "es-MX" },
  { flag: FR, name: "French", code: "fr-FR" },
  { flag: DE, name: "German", code: "de-DE" },
  { flag: IT, name: "Italian", code: "it-IT" },
  { flag: CN, name: "Chinese (Mandarin)", code: "zh (cmn-Hans-CN)" },
  { flag: JP, name: "Japanese", code: "ja-JP" },
];

const scenarioTexts = [
  {
    description: "Practice ordering from a waiter at a restaurant.",
    speaker: "waiter",
    background: "I'm a customer who's ordering at a restaurant.",
  },
  {
    description: "Ask for directions back to your hotel.",
    speaker: "stranger",
    background:
      "I'm lost in an unfamiliar country and I need help getting back to my hotel.",
  },
  {
    description: "Buy souvenirs at a gift shop.",
    speaker: "vendor",
    background:
      "I'm interested in some of the souvenirs you're selling and would like to buy some to take home.",
  },
];

const EntryPage = ({ onOptionSelect, imageVisible }) => {
  const [selected, setSelected] = useState({
    name: "Select a language",
  });

  const [selectedSpeed, setSelectedSpeed] = useState(1.0);

  const [speaker, setSpeaker] = useState("");
  const [background, setBackground] = useState("");

  const handleSpeakerChange = (event) => {
    setSpeaker(event.target.value);
  };

  const handleBackgroundChange = (event) => {
    setBackground(event.target.value);
  };

  const handlePremadeScenario = (scenario) => {
    setSpeaker(scenario.speaker);
    setBackground(scenario.background);
  };

  const handleSpeedChange = (target) => {
    setSelectedSpeed(target);
  };

  return (
    <div className="flex">
      <div className="flex flex-col flex-grow items-center p-16 left-half shadow-xl">
        <h1 className="text-3xl font-bold">
          The best way to learn a new language.
        </h1>
        <div className="mt-8">
          <Listbox
            as="div"
            value={selected}
            onChange={setSelected}
            className="relative w-96"
          >
            <div className="relative mt-1">
              <Listbox.Button className="inline-flex flex items-center w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {selected.flag ? (
                  <selected.flag className="mr-2 w-6 h-3" />
                ) : null}
                <span className="text-left flex-grow">{selected.name}</span>
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Listbox.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {languages.map((person, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative cursor-pointer py-2 pl-4 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <div className="flex items-center">
                        <person.flag className="mr-2 w-6 h-3" />
                        <span className="block truncate text-sm font-medium flex-grow">
                          {person.name}
                        </span>
                        {selected ? (
                          <span className="inset-y-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

        <div className={`w-full mt-8 flex flex-col items-center`}>
          <div
            className={`w-full max-w-md ${
              selected.flag ? "visible" : ""
            } slide-up`}
          >
            <label
              htmlFor="speaker"
              className="block text-base font-medium text-gray-700"
            >
              I'd like to practice talking to a:
            </label>
            <input
              type="text"
              id="speaker"
              name="speaker"
              rows="5"
              className="block mb-2 mt-2 w-full max-w-md bg-white resize-none focus:bg-white focus:ring-indigo-500 focus:border-indigo-500
            border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm text-gray-900 placeholder:text-gray-400 placeholder:text-italic"
              placeholder="waiter, taxi driver, gate agent..."
              onChange={handleSpeakerChange}
              value={speaker}
            />

            <label
              htmlFor="scenario"
              className="block text-base font-medium text-gray-700"
            >
              Enter in optional background info for your conversation:
            </label>
            <textarea
              id="scenario"
              name="scenario"
              rows="3"
              className="mt-2 block w-full max-w-md bg-white resize-none focus:bg-white focus:ring-indigo-500 focus:border-indigo-500
            border border-gray-300 rounded-md shadow-sm py-3 px-4 text-sm text-gray-900 placeholder-gray-400"
              placeholder="Enter your scenario here..."
              onChange={handleBackgroundChange}
              value={background}
            ></textarea>
          </div>

          <div
            className={`flex flex-col items-center ${
              selected.flag ? "visible" : ""
            } slide-up-delay`}
          >
            <div className="text-base font-medium text-gray-700 mt-6">
              or choose from one of our examples:
            </div>
            <div className="flex flex-col mt-2 gap-y-2">
              {scenarioTexts.map((scenario, index) => (
                <button
                  className="w-full py-2 px-4 text-base duration-100 flex items-center
                    rounded bg-gray-200 hover:bg-amber-700 hover:text-white"
                  onClick={() => handlePremadeScenario(scenario)}
                  key={`example${index}`}
                >
                  <span className="flex-grow text-left mr-4">
                    {scenario.description}
                  </span>{" "}
                  <span>
                    <ArrowRightIcon className="w-4 h-4 inline" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-8 flex flex-col items-center btn-slide-up ${
            speaker === "" ? "" : "visible"
          }`}
        >
          <div className="flex items-center">
            <span className="font-medium">Speaking speed:</span>
            <div className="ml-2 flex items-center justify-center">
              <SpeedMenu onSelectedSpeed={handleSpeedChange} />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="mt-6 bg-blue-700 duration-100 enabled:hover:bg-blue-800 text-white font-semibold text-lg py-2 px-4 rounded inline-flex flex items-center"
              onClick={() => {
                onOptionSelect({
                  language: selected.name,
                  languageCode: selected.code,
                  flag: selected.flag,
                  speaker: speaker,
                  background: background,
                  speed: selectedSpeed,
                });
              }}
            >
              <PaperAirplaneIcon className="w-4 h-4 mr-2" />
              <span>Start Chatting!</span>
            </button>
          </div>
        </div>
      </div>
      <div className="right-half">
        {imageVisible ? <img src={image} className="right-image" /> : null}
      </div>
    </div>
  );
};

export default EntryPage;
