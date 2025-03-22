async function Fetchinvites() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch("http://localhost:8000/get_invites/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie("access_token")}`,
                    "X-CSRFToken": getCookie("csrftoken")
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('the-invites', JSON.stringify(data));
                resolve(data);
            } else {
                console.error("Failed to fetch invites:", response.status);
                reject(null);
            }
        } catch (error) {
            console.error("Error fetching invites:", error);
            reject(null);
        }
    });
}