const submitButton = document.getElementById("submitButton");
const userInput = document.getElementById("userInput");
const results = document.getElementById("results");
const modeInput = document.getElementById("modeInput");
const typeInput = document.getElementById("typeInput");
const switchInput = document.getElementById("switchInput");

chrome.storage.sync.get([ "defaultMode", "defaultType" ], ({ defaultMode, defaultType }) => {
    modeInput.value = defaultMode || "alpha";
    typeInput.value = defaultType || "summarize";
})

function handleSubmit() {
    if (userInput.value.trim() === "") {
        results.textContent = "Enter something bro."
        return;
    }
    chrome.storage.sync.get([ "geminiApiKey" ], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            results.textContent = "No API key set. Click on the gear icon to the right of the \"Enter\" button in this popup to set the API key in \"Settings.\""
            return;
        }
        (async () => {
            try {
                results.textContent = "Give bro a sec...";
                const context = await geminiChecking(userInput.value.trim(), geminiApiKey, modeInput.value, typeInput.value);
                results.textContent = context;
            } catch (error) {
                results.textContent = "Gemini Error: " + error.message + " Click on the gear icon to the right of the \"Enter\" button in this popup to reset the API key in \"Settings.\"";
            }
        })();    
    })
}



submitButton.addEventListener( "click", handleSubmit)
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSubmit();
  }
});


async function geminiChecking(text, apiKey, mode, type) {

    // Tell the truth, do not word anything that is incorrect or misleading.
    // Make sure to tell the truth and do not use any words that are incorrect or misleading.

    const summarizeMap = {
        alpha: `Summarize this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent hood, gen Z, and gen alpha slangs:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        normal :`Summarize this ${switchInput.checked ? "in one sentence" : ""}:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        easy :`Summarize this ${switchInput.checked ? "in one sentence" : ""} so that it is easy to understand to someone at any age:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        hood: `Summarize this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent hood and AAVE slangs:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        fruity: `Summarize this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent stan twitter, fruity, diva, gay, and girly slangs:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
    };
    const explainMap = {
        alpha: `Explain this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent hood, gen Z, and gen alpha slangs:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        normal :`Explain this ${switchInput.checked ? "in one sentence" : ""}:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        easy :`Explain this ${switchInput.checked ? "in one sentence" : ""} so that it is easy to understand to someone at any age:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        hood: `Explain this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent hood and AAVE slangs:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        fruity: `Explain this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent stan twitter, fruity, diva, gay, and girly slangs:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
    };
    const answerMap = {
        alpha: `Answer this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent hood, gen Z, and gen alpha slangs:\n\n"${text}". Start directly with the answer, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        normal :`Answer this ${switchInput.checked ? "in one sentence" : ""}:\n\n"${text}". Start directly with the answer, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        easy :`Answer this ${switchInput.checked ? "in one sentence" : ""} so that it is easy to understand to someone at any age:\n\n"${text}". Start directly with the answer, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        hood: `Answer this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent hood and AAVE slangs:\n\n"${text}". Start directly with the answer, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        fruity: `Answer this ${switchInput.checked ? "in one sentence" : ""} so that it uses recent stan twitter, fruity, diva, gay, and girly slangs:\n\n"${text}". Start directly with the answer, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise and straight-to-the-point, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
    };
    const typeMap = {
        summarize: summarizeMap,
        explain: explainMap,
        answer: answerMap
    }

    const fetchLink = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    const context = await fetch(fetchLink,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: typeMap[type][mode] }] }],
                generationConfig: { temperature: 0.5 },
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