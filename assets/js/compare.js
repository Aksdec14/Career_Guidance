document.addEventListener("DOMContentLoaded", function () {
    const careerDropdown1 = document.getElementById("career1");
    const careerDropdown2 = document.getElementById("career2");
    const compareTable = document.getElementById("compare-table");
    let careersData = [];

    // Fetch career data from JSON file
    fetch("assets/data/careers.json")
        .then(response => response.json())
        .then(data => {
            careersData = data;
            populateDropdowns(careersData);
        })
        .catch(error => console.error("Error loading careers data:", error));

    // Populate dropdowns with career names
    function populateDropdowns(careers) {
        careers.forEach(career => {
            let option1 = document.createElement("option");
            option1.value = career.name;
            option1.textContent = career.name;

            let option2 = option1.cloneNode(true);

            careerDropdown1.appendChild(option1);
            careerDropdown2.appendChild(option2);
        });
    }

    // Event listeners for dropdowns
    careerDropdown1.addEventListener("change", updateComparison);
    careerDropdown2.addEventListener("change", updateComparison);

    function updateComparison() {
        let selectedCareer1 = careersData.find(career => career.name === careerDropdown1.value);
        let selectedCareer2 = careersData.find(career => career.name === careerDropdown2.value);

        if (selectedCareer1 && selectedCareer2) {
            compareTable.innerHTML = `
                <tr>
                    <th>Feature</th>
                    <th>${selectedCareer1.name}</th>
                    <th>${selectedCareer2.name}</th>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>${selectedCareer1.description}</td>
                    <td>${selectedCareer2.description}</td>
                </tr>
                <tr>
                    <td>Traits</td>
                    <td>${selectedCareer1.traits.join(", ")}</td>
                    <td>${selectedCareer2.traits.join(", ")}</td>
                </tr>
                <tr>
                    <td>Average Salary</td>
                    <td>${selectedCareer1.averageSalary}</td>
                    <td>${selectedCareer2.averageSalary}</td>
                </tr>
                <tr>
                    <td>Workload</td>
                    <td>${selectedCareer1.workload}</td>
                    <td>${selectedCareer2.workload}</td>
                </tr>
                <tr>
                    <td>Future Scope</td>
                    <td>${selectedCareer1.futureScope}</td>
                    <td>${selectedCareer2.futureScope}</td>
                </tr>
                <tr>
                    <td>How to Start</td>
                    <td>${selectedCareer1.howToStart}</td>
                    <td>${selectedCareer2.howToStart}</td>
                </tr>
            `;
        }
    }
});
