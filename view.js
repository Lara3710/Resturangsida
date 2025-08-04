const View = (() => {

    const TL = {
        Maträtt: (id, name, description, price, mealText) => {
            return`
            <section class="maträtt" id="meal_${id}">
                <h2>${name}</h2>
                <p>${description}</p>
                <div class="maträtt_detaljer">
                    <section>
                        <section class="kött">
                            <h3>${mealText.meat}</h3>
                        </section>
                        
                        <h3>${mealText.allergies}</h3>
                        <section class="allergier">
                        </section>
                    </section>
                    <span class="money">${price} Kr</span>
                </div>
                <button class="mealBtn addBtn">+</button>
            </section>`
        },
        MeatTL: (meatText) => {
            const MeatTypes = {
                pork: `<img src="Images/Kött/pork.png" alt="${meatText.porkImgAlt}" class="porkImg">`,
                beef:  `<img src="Images/Kött/beef.png" alt="${meatText.beefImgAlt}" class="beefImg">`,
                chicken: `<img src="Images/Kött/chicken.png" alt="${meatText.chickenImgAlt}" class="chickenImg">`,
                fish: `<img src="Images/Kött/fish.png" alt="${meatText.fishImgAlt}" class="fishImg">`,
                veg: `<img src="Images/Kött/vegetarian.png" alt="${meatText.vegImgAlt}" class="vegImg">`
            }

            return MeatTypes;
        },
        AllergiesTL: (allergyText) => {
            const AllergyTypes = {
                gluten: `<img src="Images/Allergier/gluten.png" alt="${allergyText.glutenImgAlt}" class="glutenImg"/>`,
                lactose: `<img src="Images/Allergier/lactose.png" alt="${allergyText.lactoseImgAlt}" class="lactoseImg"/>`,
                egg: `<img src="Images/Allergier/egg.png" alt="${allergyText.eggImgAlt}" class="eggImg"/>`,
                shellfish: `<img src="Images/Allergier/shellfish.png" alt="${allergyText.shellfishImgAlt}" class="shellfishImg"/>`
            }

            return AllergyTypes;
        },
        PriceSlider: (minPrice, maxPrice) => {
            return `                
            <label for="priceRange" id="priceValue">Price: ${maxPrice} Kr</label>
                <input 
                    type="range" 
                    id="priceRange" 
                    name="priceRange"
                    min="${minPrice}" 
                    max="${maxPrice}" 
                    step="5" 
                    value="${maxPrice}">`
        }
    }

    const BindInput = {
        BindButton: (btnClassName, btnFunction) => {
            const buttonTag = document.querySelector(btnClassName);
            buttonTag.addEventListener("click", btnFunction);
        },
        BindCheckBox: (cbxName, cbxFunction) => {
            const checkboxesTags = document.querySelectorAll(`input[name="${cbxName}"]`);

            checkboxesTags.forEach(checkbox => {
                checkbox.addEventListener('change', cbxFunction);
            });
        },
        BindRadioBox: (rbxName, rbxFunction) => {
            const radioboxesTags = document.querySelectorAll(`input[name="${rbxName}"]`);
            radioboxesTags.forEach(radiobox => {
                radiobox.addEventListener('change', rbxFunction);
            });
        },
        GetCheckBoxesValue: (cbxName) => {
            const checkedCbxs = [...document.querySelectorAll(`input[name="${cbxName}"]:checked`)].map(e => e.value);
            return checkedCbxs;
        },
        GetRadioBoxesValue: (rbxName) => {
            return document.querySelector(`input[name="${rbxName}"]:checked`).value;
        },
        CreatePriceSlider: (minPrice, maxPrice, sliderFunction) => {
            const priceFilterTag = document.querySelector(".priceFilter");
            let slider = document.querySelector("#priceRange");

            
            if(slider === null) 
            {
                priceFilterTag.innerHTML += TL.PriceSlider(minPrice, maxPrice + 10);
                slider = document.querySelector("#priceRange");
                const priceTag = document.querySelector("#priceValue");

                slider.addEventListener('input', () => {
                    sliderFunction();
                    priceTag.textContent = "Price: " + slider.value + " Kr"; 
                });
            }
        },
        GetPriceSliderChange: (defaultValue) => {
            const slider = document.querySelector("#priceRange");

            if(slider)
            {
                return slider.value;
            }

            return defaultValue;

        }
    }

    const CreateMealTLs = (mealsToCreate, lang) => {
        const mainTag = document.querySelector("main");

        const mealText = JSON.parse(localStorage.getItem("mealText"));

        mealsToCreate.forEach(meal =>
        {
            let mealTL;

            if(lang === "en")
            {
                mealTL = View.TL.Maträtt(meal.id, meal.namn.en, meal.beskrivning.en, meal.pris, mealText);
            }
            else if(lang === "sv")
            {
                mealTL = View.TL.Maträtt(meal.id, meal.namn.sv, meal.beskrivning.sv, meal.pris, mealText);
            }

            mainTag.innerHTML += mealTL;

            DisplayMeat(meal.meat, meal.id, mealText.meatIconText);
            DisplayAllergies(meal.allergier, meal.id, mealText.allergyIconText);
        }
        );
    }

    const DisplayMeat = (meatInMeal, mealId, altTxt) => {

        meatInMeal.forEach(meat => {
            const tag = document.querySelector(`#meal_${mealId}`).querySelector('.kött');

            switch(meat)
            {
                case "pork":
                    tag.innerHTML += View.TL.MeatTL(altTxt).pork;
                    break;
                case "beef":
                    tag.innerHTML += View.TL.MeatTL(altTxt).beef;
                    break;
                case "chicken":
                    tag.innerHTML += View.TL.MeatTL(altTxt).chicken;
                    break;
                case "fish":
                    tag.innerHTML += View.TL.MeatTL(altTxt).fish;
                    break;
                case "vegetarian":
                    tag.innerHTML += View.TL.MeatTL(altTxt).veg;
                    break;
            }
        });
    }

    const DisplayAllergies = (allergiesInMeal, mealId, altTxt) => {

        allergiesInMeal.forEach(allergy => {
            const tag = document.querySelector(`#meal_${mealId}`).querySelector(".allergier");

            switch(allergy)
            {
                case "Gluten":
                    tag.innerHTML += View.TL.AllergiesTL(altTxt).gluten;
                    break;
                case "Lactose":
                    tag.innerHTML += View.TL.AllergiesTL(altTxt).lactose;
                    break;
                case "Egg":
                    tag.innerHTML += View.TL.AllergiesTL(altTxt).egg;
                    break;
                case "Shellfish":
                    tag.innerHTML += View.TL.AllergiesTL(altTxt).shellfish;
                    break;
            }
        });
    }

    return { TL, BindInput, CreateMealTLs };
})();

export { View };