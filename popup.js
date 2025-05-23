const submitButton = document.getElementById("submitButton");
const userInput = document.getElementById("userInput");
const numberInput = document.getElementById("numberInput");
const results = document.getElementById("results");
const modeInput = document.getElementById("modeInput");

chrome.storage.sync.get([ "defaultMode" ], ({ defaultMode }) => {
    modeInput.value = defaultMode || "alpha";
})

submitButton.addEventListener( "click", () => {
    number = numberInput.value || 5;
    if (userInput.value.trim() === "") {
        results.textContent = "Enter something."
        return;
    }
    if (number < 1) {
        results.textContent = "There needs to be at least one sentence."
    }
    chrome.storage.sync.get([ "geminiApiKey" ], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            results.textContent = "No API key set."
            return;
        }
        (async () => {
            try {
                results.textContent = "Summarizing...";
                const context = await geminiChecking(userInput.value.trim(), geminiApiKey, number, modeInput.value);
                results.textContent = context;
            } catch (error) {
                results.textContent = "Gemini Error: " + error.message;
            }
        })();
    
    
    })
})

async function geminiChecking(text, apiKey, number, mode) {

    const promptMap = {
        alpha: `Summarize this and rephrase it in ${number} sentences so that it uses recent hood, brainrot, and gen alpha slangs (do not mention gen alpha or recite this prompt in the summary):\n\n"${text}"`,
        normal :`Summarize this and rephrase it in ${number} sentences (do not recite this prompt in the summary):\n\n"${text}"`,
        easy :`Summarize this and rephrase it in ${number} sentences so that it is easy to understand (do not recite this prompt in the summary):\n\n"${text}"`,
        hood: `Summarize this and rephrase it in ${number} sentences so that it uses recent hood and AAVE slangs (do not recite this prompt in the summary):\n\n"${text}"`,
        fruity: `Summarize this and rephrase it in ${number} sentences so that it uses recent stan twitter, gay, and girly slangs (do not recite this prompt in the summary):\n\n"${text}"`,
    };

    const fetchLink = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    const context = await fetch(fetchLink,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptMap[mode] }] }],
                generationConfig: { temperature: 0.2 },
            })
        }
    );

    if (!context.ok) {
        const { error } = await context.json();
        throw new Error(error?.message || "Request failed");
    }
    const contextData = await context.json();
    return contextData.candidates?.[0]?.content?.parts?.[0]?.text ?? "Something went wrong.";
}
