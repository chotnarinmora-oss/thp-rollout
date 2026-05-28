let indexedData = [];

fetch("data.json")
.then(res => res.json())
.then(data => {

    indexedData = data.map(item => {

        return {

            OutletCode:
                String(item.OutletCode || ""),

            PostOfficeName:
                String(item.PostOfficeName || ""),

            Province:
                String(item.Province || ""),

            GroupId:
                String(item.GroupId || ""),

            _searchIndex:

                (
                    String(item.OutletCode || "") + " " +
                    String(item.PostOfficeName || "") + " " +
                    String(item.Province || "") + " " +
                    String(item.GroupId || "")

                ).toLowerCase()

        };

    });

    updateAllDropdowns(indexedData);

    renderTable(indexedData);

})
.catch(err => {

    console.error(err);

    document
    .getElementById("resultCount")
    .innerText =
        "โหลดข้อมูลไม่สำเร็จ";

});

function renderTable(list) {

    const table =
        document.getElementById("tableBody");

    table.innerHTML = "";

    list.slice(0, 300).forEach(item => {

        const tr =
            document.createElement("tr");

        tr.innerHTML =

            "<td>" + item.OutletCode + "</td>" +

            "<td>" + item.PostOfficeName + "</td>" +

            "<td>" + item.Province + "</td>" +

            "<td>" + item.GroupId + "</td>";

        table.appendChild(tr);

    });

    if (list.length > 0) {

        document
        .getElementById("resultCount")
        .innerText =

            "พบ " +
            list.length +
            " รายการ";

        if (list.length > 300) {

            document
            .getElementById("resultCount")
            .innerText +=
                " (แสดงสูงสุด 300 รายการ)";
        }

    }

}

function updateDropdown(id, values) {

    const select =
        document.getElementById(id);

    const currentValue =
        select.value;

    const uniqueValues =

        [...new Set(values)]
        .filter(v => v)
        .sort();

    select.innerHTML =
        '<option value="">ทั้งหมด</option>';

    uniqueValues.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        if (value === currentValue) {
            option.selected = true;
        }

        select.appendChild(option);

    });

}

function updateAllDropdowns(data) {

    updateDropdown(
        "filterOutlet",
        data.map(x => x.OutletCode)
    );

    updateDropdown(
        "filterPost",
        data.map(x => x.PostOfficeName)
    );

    updateDropdown(
        "filterProvince",
        data.map(x => x.Province)
    );

    updateDropdown(
        "filterGroup",
        data.map(x => x.GroupId)
    );

}

function applyFilters() {

    const keyword =

        document
        .getElementById("searchBox")
        .value
        .trim()
        .toLowerCase();

    const outlet =
        document
        .getElementById("filterOutlet")
        .value;

    const post =
        document
        .getElementById("filterPost")
        .value;

    const province =
        document
        .getElementById("filterProvince")
        .value;

    const group =
        document
        .getElementById("filterGroup")
        .value;

    const filtered =

        indexedData.filter(item => {

            return (

                item._searchIndex
                .includes(keyword)

                &&

                (
                    !outlet ||
                    item.OutletCode === outlet
                )

                &&

                (
                    !post ||
                    item.PostOfficeName === post
                )

                &&

                (
                    !province ||
                    item.Province === province
                )

                &&

                (
                    !group ||
                    item.GroupId === group
                )

            );

        });

    renderTable(filtered);

    updateAllDropdowns(filtered);

}

let timeout;

document
.getElementById("searchBox")
.addEventListener("input", function() {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

        applyFilters();

    }, 300);

});

document
.querySelectorAll("select")
.forEach(select => {

    select.addEventListener(
        "change",
        applyFilters
    );

});

document
.getElementById("clearButton")
.addEventListener("click", () => {

    // Clear Search

    document
    .getElementById("searchBox")
    .value = "";

    // Clear Dropdown

    document
    .getElementById("filterOutlet")
    .value = "";

    document
    .getElementById("filterPost")
    .value = "";

    document
    .getElementById("filterProvince")
    .value = "";

    document
    .getElementById("filterGroup")
    .value = "";

    // Render All

    renderTable(indexedData);

    updateAllDropdowns(indexedData);

});

