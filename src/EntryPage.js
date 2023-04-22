import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { US, ES, FR, DE } from "country-flag-icons/react/3x2";

const languages = [
  { flag: US, name: "English (United States)" },
  { flag: ES, name: "Spanish" },
  { flag: FR, name: "French" },
  { flag: DE, name: "German" },
];

const EntryPage = (props) => {
  const [selected, setSelected] = useState({
    name: "Select a language",
  });

  const [scenario, setScenario] = useState("");

  const handleScenarioChange = (event) => {
    setScenario(event.target.value);
  };

  return (
    <div className="flex flex-col py-24 items-center gap-y-24">
      <div>
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

      <div className="w-full max-w-md">
        <label
          htmlFor="scenario"
          className="block text-sm font-medium text-gray-700"
        >
          Scenario:
        </label>
        <textarea
          id="scenario"
          name="scenario"
          rows="5"
          className="mt-1 block w-full bg-white resize-none focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md shadow-sm py-3 px-4 text-sm text-gray-900 placeholder-gray-400"
          placeholder="Enter your scenario here..."
          onChange={handleScenarioChange}
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          className="mt-4 bg-green-700 duration-100 enabled:hover:bg-green-800 text-white font-semibold py-2 px-4 rounded inline-flex flex items-center disabled:opacity-50"
          onClick={() => {
            props.onOptionSelect({
              language: selected.name,
              flag: selected.flag,
              scenario: scenario,
            });
          }}
          disabled={!scenario}
        >
          <PaperAirplaneIcon className="w-4 h-4 mr-2" />
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default EntryPage;
