// Plan

// Main

// Rendera maträtt

// En funktion som hämtar maträtter och skapar ett objekt av det
// En template literal mall för varje maträtt
// En funktion som renderar maträtten

// Filter

// Läs av vilka checkboxar som är på
// Map och filter sortera de som vi vill ha
// Rendera bara de som behövs

// Varukorg funktionalitet

// Om man trycker på +
// Lägg till maträtten i varukorg
// I varukorgen
// Skriv upp vad man köpt och pris
// Man ska kunna ta bort en maträtt eller sätta 2 eller mer av en

// Byt språk

// Byt språk för maträtter
// Byt språk för UI


import { View } from './view.js';
import { Filter } from './filter.js';
import { Varukorg } from './varukorg.js';
import { Language } from './language.js';

export const App = (() => {

    const Maträtter = {
        ImporteraMaträtter: async () => {
            const maträtter = await fetch('maträtter.json');

            if(!maträtter.ok)
            {
                console.log("fel");
            }

            return await maträtter.json();
        },
        RefreshMaträtterArray: (meatChoices, allergyChoices, priceSortType, maxPrice) => {
            Maträtter.ImporteraMaträtter().then((maträtter) => {
                const mainTag = document.querySelector("main");
                mainTag.innerHTML = '';

                const meatFilteredArr = Filter.ApplyFilter.ApplyMeatFilter(maträtter, meatChoices);
                const allergyFilteredArr = Filter.ApplyFilter.ApplyAllergyFilter(meatFilteredArr, allergyChoices);


                const prices = maträtter.map(e => e.pris);
                Buttons.priceMin = Math.min(...prices);
                Buttons.priceMax = Math.max(...prices);

                Buttons.UpdateSlider(Buttons.priceMin, Buttons.priceMax);

                const priceFilteredArr = Filter.PriceFilter.BestämSorteringSätt(priceSortType, allergyFilteredArr, maxPrice);
                
                const lang = localStorage.getItem("language") || "en";
                View.CreateMealTLs(priceFilteredArr, lang);
                Varukorg.Main(maträtter);

                Buttons.GetInputFromRbx("price");
            });
        }
    }

    const Buttons = {
        meatChoices: [],
        allergyChoices: [],
        priceSortType: "dec",
        priceMax: 0,
        priceMin: 0,
        GetInputFromButtons: (type) => {
            View.BindInput.BindCheckBox(type, () => {
                const choices = View.BindInput.GetCheckBoxesValue(type);

                if (type === "meat") {
                    Buttons.meatChoices = choices;
                } else if (type === "allergy") {
                    Buttons.allergyChoices = choices;
                } 
                Maträtter.RefreshMaträtterArray(Buttons.meatChoices, Buttons.allergyChoices, Buttons.priceSortType, Buttons.priceMax);
            });
        },
        GetInputFromRbx: (type) => {

            View.BindInput.BindRadioBox(type, () => {
                const choice = View.BindInput.GetRadioBoxesValue(type);
                if (type === "price") {
                    Buttons.priceSortType = choice;
                }
                
                Maträtter.RefreshMaträtterArray(Buttons.meatChoices, Buttons.allergyChoices, Buttons.priceSortType, Buttons.priceMax);
            });
        },
        UpdateSlider: (min, max) => {
            View.BindInput.CreatePriceSlider(min, max, () => {
                Buttons.priceMax = View.BindInput.GetPriceSliderChange(max);
                Maträtter.RefreshMaträtterArray(Buttons.meatChoices, Buttons.allergyChoices, Buttons.priceSortType, Buttons.priceMax);
            });
        }
    }

    const Main = () => {
        Language.Main();
        
        Maträtter.RefreshMaträtterArray(Buttons.meatChoices, Buttons.allergyChoices, Buttons.priceSortType, 1000)
        Buttons.GetInputFromButtons("meat");
        Buttons.GetInputFromButtons("allergy");

    }

    return { Main, Maträtter, Buttons };
})();

