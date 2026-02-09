document.addEventListener("DOMContentLoaded", function () {
    addParam();

    document.getElementById("method").dispatchEvent(new Event("change"));
    document.getElementById("sendBtn").addEventListener("click", sendRequest);
});


    document.getElementById("method").addEventListener("change", function () {
    const bodyBox = document.getElementById("bodyBox");
    const bodyInput = document.getElementById("body");

    // Hiển thị body khi POST / PUT
    if (this.value === "POST" || this.value === "PUT") {
        bodyBox.style.display = "block";
    } else {
        bodyBox.style.display = "none";
        bodyInput.value = ""; // clear body khi GET / DELETE
    }

    // Highlight DELETE
    this.classList.toggle("method-danger", this.value === "DELETE");
});

function addParam() {
    let paramsBox = document.getElementById("params");

    if (!paramsBox) {
        console.error("Không tìm thấy element #params");
        return;
    }

    let div = document.createElement("div");
    div.className = "param-row";

    div.innerHTML = `
        <input type="text" placeholder="Key" class="key">
        <input type="text" placeholder="Value" class="value">
        <button type="button" class="remove-btn" onclick="this.parentNode.remove()">×</button>
    `;

    paramsBox.appendChild(div);
}

async function sendRequest() {
    let url = document.getElementById("url").value.trim();
    let method = document.getElementById("method").value;

    if (!url) {
        alert("Vui lòng nhập URL");
        return;
    }

    // Chặn gửi DELETE nhầm
    if (method === "DELETE") {
        const confirmDelete = confirm(
            "⚠️ Bạn đang gửi DELETE request.\nHành động này có thể xóa dữ liệu.\n\nBạn có chắc chắn muốn tiếp tục?"
        );

        if (!confirmDelete) {
            return;
        }
    }


    // Lấy Query Params
    let params = {};
    document.querySelectorAll(".param-row").forEach(row => {
        let key = row.querySelector(".key").value.trim();
        let val = row.querySelector(".value").value.trim();
        if (key) params[key] = val;
    });

    // Gắn query vào URL
    let query = new URLSearchParams(params).toString();
    if (query) url += "?" + query;

    let options = { method };

    // Body cho POST & PUT & DELETE
    if (method === "POST" || method === "PUT" || method === "DELETE") {
        let bodyText = document.getElementById("body").value.trim();

        if (bodyText) {
            try {
                options.body = JSON.stringify(JSON.parse(bodyText));
                options.headers = { "Content-Type": "application/json" };
            } catch (err) {
                alert("Body JSON không hợp lệ!");
                return;
            }
        }
    }


    document.getElementById("resultBox").textContent = "Đang gửi request...";

    try {
        let res = await fetch(url, options);
        let text = await res.text();

        // cố parse JSON nếu được
        try {
            text = JSON.stringify(JSON.parse(text), null, 2);
        } catch {}

        document.getElementById("resultBox").textContent = text;

    } catch (error) {
        document.getElementById("resultBox").textContent = "Lỗi: " + error;
    }
}
