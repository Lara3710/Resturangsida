const Filter = (() => {

    const ApplyFilter = {
        ApplyMeatFilter: (meals, preferedMeatTypes) => {

            if(preferedMeatTypes.length === 0)
            {
                return meals;   // Returnera alla maträtter om inget filter är valt
            }

            // Returnera maträtten i maträtter som innehåller en köttyp som man vill ha
            return meals.filter(meal => 
                // Om någon köttyp i maträtten överrensstämmer med vad användaren valt
                preferedMeatTypes.some(meatType => meal.meat.includes(meatType)) 
            );

        },
        ApplyAllergyFilter: (meals, allergies) => {

            if (allergies.length === 0) {
                return meals;
            }
    
            return meals.filter(meal => 
                // Om maträtten inte har någon allergi som överrensstämmer med vad användaren valt
                !allergies.some(allergy => meal.allergier.includes(allergy))
            );
        }
    }

    const PriceFilter = {
        BestämSorteringSätt: (input, arrayToSort, maxPrice) => {
            const underMax = arrayToSort.filter(m => m.pris <= maxPrice);

            if(input === "dec")
            {
                return PriceFilter.PrisFallande(underMax);
            }
            else if(input === "inc")
            {
                return PriceFilter.PrisStigande(underMax);
            }
        },
        PrisStigande: (arrayToSort) => {
            arrayToSort.sort((a, b) => { return a.pris - b.pris });
            // Om a är större än b blir talet positivt --> större
            // Om b är större än a blir talet negativt --> mindre
            return arrayToSort;
        },
        PrisFallande: (arrayToSort) => {
            arrayToSort.sort((a, b) => { return b.pris - a.pris });

            return arrayToSort;
        }
    };

    return { ApplyFilter, PriceFilter }
})();

export { Filter };