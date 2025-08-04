
import { App } from './App.js';

const Language = (() => {
    const TemplateLiteral = {
        WebsiteStructure: (lang) => {
            return `

    <header>
        <img class="resturangensLogga" src="Images/Lucky Duck Logo.png" alt="${lang.header.logoImgAlt}">

        <form class="språkNav">
            <label for="språkval" class="väljSpråkLbl">${lang.header.chooseLangLbl}</label>
            <input type="checkbox" id="språkval" hidden/>

            <section class="språk_dropdown">
                <label for="lang_sv" class="språkLabel">${lang.header.swedish}
                    <input type="radio" id="lang_sv" name="language" value="sv"/>
                </label>

                <label for="lang_en" class="språkLabel">${lang.header.english}
                    <input type="radio" id="lang_en" name="language" value="en"/>
                </label>
            </section>
        </form>


        <h1 class="rubrik">${lang.header.menuTitle}</h1>

        <nav class="varukorgNav">
            <label for="varukorg">
                <p class="antalBeställningar" hidden>0</p>
                <img class="varukorgBild" src="Images/varukorg.png" alt="${lang.cart.cartImgAlt}">
            </label>
            <input type="checkbox" hidden id="varukorg"/>

            <section class="varukorgInnehåll">
                <h2 >${lang.cart.cartTitle}</h2>
                <ul class="varukorgUL">
                    <!-- Här ska varorna i varukorgen finnas -->

                    
                </ul>
                <section class="betalaBtn_total">
                    <button class="betalaKnapp">${lang.cart.payBtn}</button>
                    <p class="attBetala">Total: </p>
                </section>
                <p class="betalatMeddelande" hidden>${lang.cart.uHavePaid}</p>
            </section>
        </nav>
    </header>

    <section class="filter_main">
        <nav class="filter">
            <h2>${lang.filter.filterTitle}</h2>
            <div class="fieldset-row">
                <fieldset class="priceFilter">
                    <legend>${lang.filter.price.title}</legend>
                    <!-- Pris stigande/fallande -->

                    <label for="price_increasing" class="priceFilterLabel">${lang.filter.price.inc}
                        <input type="radio" id="price_increasing" name="price" value="inc"/>
                    </label>

                    <label for="price_decreasing" class="priceFilterLabel">${lang.filter.price.dec}
                        <input type="radio" id="price_decreasing" name="price" value="dec" checked/>
                    </label>

                    <!-- <label for="priceRange" id="priceValue">${lang.filter.price.sliderText}</label>
                    <input 
                        type="range" 
                        id="priceRange" 
                        name="priceRange"
                        min="85" 
                        max="259" 
                        step="10" 
                        value="100"> -->
                </fieldset>

                <fieldset>
                    <legend>${lang.filter.meat.title}</legend>

                    <label for="meat_beef" class="meatlabel">${lang.filter.meat.beef}
                        <input type="checkbox" id="meat_beef" name="meat" value="beef"/>
                    </label>

                    <label for="meat_chicken" class="meatlabel">${lang.filter.meat.chicken}
                        <input type="checkbox" id="meat_chicken" name="meat" value="chicken"/>
                    </label>

                    <label for="meat_pork" class="meatlabel">${lang.filter.meat.pork}
                        <input type="checkbox" id="meat_pork" name="meat" value="pork"/>
                    </label>

                    <label for="meat_fish" class="meatlabel">${lang.filter.meat.fish}
                        <input type="checkbox" id="meat_fish" name="meat" value="fish"/>
                    </label>

                    <label for="meat_veg" class="meatlabel">${lang.filter.meat.veg}
                        <input type="checkbox" id="meat_veg" name="meat" value="vegetarian"/>
                    </label>
                </fieldset>

                <fieldset>
                    <legend>${lang.filter.allergy.title}</legend>

                    <label for="allergy_gluten" class="allergylabel">${lang.filter.allergy.gluten}
                        <input type="checkbox" id="allergy_gluten" name="allergy" value="Gluten"/>
                    </label>

                    <label for="allergy_lactose" class="allergylabel">${lang.filter.allergy.lactose}
                        <input type="checkbox" id="allergy_lactose" name="allergy" value="Lactose"/>
                    </label>

                    <label for="allergy_egg" class="allergylabel">${lang.filter.allergy.egg}
                        <input type="checkbox" id="allergy_egg" name="allergy" value="Egg"/>
                    </label>

                    <label for="allergy_shellfish" class="allergylabel">${lang.filter.allergy.shellfish}
                        <input type="checkbox" id="allergy_shellfish" name="allergy" value="Shellfish"/>
                    </label>
                </fieldset>
            </div>
        </nav>

        <main>

        </main>
    </section>

            
            `
        }
    }

    const HanteraSpråk = {
        ImporteraSpråkText: async () => {
            const språk = await fetch('UI.json');

            if(!språk.ok)
            {
                console.log("fel");
            }

            return await språk.json();
        },
        RefreshSpråkArray: (språkVal) => {
            HanteraSpråk.ImporteraSpråkText().then((språk) => {

                let språkObj;

                switch(språkVal) 
                {
                    case "en": 
                        språkObj = språk.en;
                        break;
                    case "sv": 
                        språkObj = språk.sv;
                        break;
                    default:
                        språkObj = språk.en;
                        break;
                }

                HanteraSpråk.RenderSiteStructure(språkObj);

                App.Buttons.GetInputFromButtons("meat");
                App.Buttons.GetInputFromButtons("allergy");
                App.Buttons.GetInputFromButtons("price");

                const mealTxt = JSON.stringify(språkObj.mealsText);
                localStorage.setItem("mealText", mealTxt);

            });
        },
        RenderSiteStructure: (språkObj) => {

            const siteTL = TemplateLiteral.WebsiteStructure(språkObj);
            const bodyTag = document.querySelector("body");

            bodyTag.innerHTML = siteTL;

            Knappar.BindRadioBox("language", () => {
                const selectedLanguage = Knappar.GetRadioBoxesValue("language");
                HanteraSpråk.RefreshSpråkArray(selectedLanguage);
            });

            App.Maträtter.RefreshMaträtterArray([], [], "dec", 1000);
        }
    }

    const Knappar = {
        BindRadioBox: (rbxName, rbxFunction) => {
            const radioboxesTags = document.querySelectorAll(`input[name="${rbxName}"]`);
            
            radioboxesTags.forEach(radiobox => {
                radiobox.addEventListener('change', () => {
                    const selectedLanguage = Knappar.GetRadioBoxesValue(rbxName);
                    const currentLanguage = localStorage.getItem("language") || "en"; // om localstorage inte finns, spara engelska
    
                    if (selectedLanguage !== currentLanguage) {
                        rbxFunction();
                        localStorage.setItem("language", selectedLanguage);
                    }
                });
            });
        },
        GetRadioBoxesValue: (rbxName) => {
            return document.querySelector(`input[name="${rbxName}"]:checked`).value;
        }
    }

    const Main = () => {
        const sparatSpråk = localStorage.getItem("language") || "en";
        HanteraSpråk.RefreshSpråkArray(sparatSpråk);
    }

    return { Main }

})();

export { Language };