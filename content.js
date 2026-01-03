if (!window.__aiBroInjected) {
  window.__aiBroInjected = true;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  showFloatingSummary(message.mode, message.text, message.action);
  });
}

function showFloatingSummary(mode, text, type) {
  const existing = document.getElementById('summary-popup');
  if (existing) existing.remove();
  if (text === undefined) {
    return;
  }

  const popup = document.createElement('div');
  popup.id = 'summary-popup';
  
  // Complete CSS reset and isolation
  popup.style.cssText = `
    all: initial !important;
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 300px !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    background: #004aad !important;
    color: white !important;
    padding: 15px !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    font-weight: normal !important;
    line-height: 20px !important;
    z-index: 2147483647 !important;
    cursor: grab !important;
    box-sizing: border-box !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    margin: 0 !important;
    border: none !important;
    outline: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    text-align: left !important;
    direction: ltr !important;
    unicode-bidi: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    isolation: isolate !important;
  `;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  popup.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    popup.style.setProperty('cursor', 'grabbing', 'important');
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      popup.style.setProperty('left', `${e.clientX - offsetX}px`, 'important');
      popup.style.setProperty('top', `${e.clientY - offsetY}px`, 'important');
      popup.style.setProperty('right', 'auto', 'important');
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    popup.style.setProperty('cursor', 'grab', 'important');
  });

  const content = document.createElement('div');
  content.id = "content";
  
  // Complete CSS reset for content div
  content.style.cssText = `
    all: initial !important;
    color: white !important;
    font-size: 14px !important;
    font-weight: normal !important;
    line-height: 20px !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    text-align: left !important;
    direction: ltr !important;
    unicode-bidi: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    box-sizing: border-box !important;
    width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    position: static !important;
    float: none !important;
    clear: none !important;
    z-index: auto !important;
    overflow: visible !important;
    clip: auto !important;
    clip-path: none !important;
    mask: none !important;
    isolation: auto !important;
  `;
  
  content.textContent = "Give bro a sec...";
  popup.appendChild(content);

  document.body.appendChild(popup);

  const summarizeMap = {
        gen_z_alpha: `Summarize this so that it uses recent hood, gen Z, and gen alpha slangs:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        normal :`Summarize this:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        easy_to_understand:`Summarize this so that it is easy to understand to someone at any age:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        hood: `Summarize this so that it uses recent hood and AAVE slangs:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        fruity: `Summarize this so that it uses recent stan twitter, fruity, diva, gay, and girly slangs:\n\n"${text}". Start directly with the summary, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
    };

    const explainMap = {
        gen_z_alpha: `Explain this so that it uses recent hood, gen Z, and gen alpha slangs:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        normal :`Explain this:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        easy_to_understand:`Explain this so that it is easy to understand to someone at any age:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        hood: `Explain this so that it uses recent hood and AAVE slangs:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
        fruity: `Explain this so that it uses recent stan twitter, fruity, diva, gay, and girly slangs:\n\n"${text}". Start directly with the explaination, excluding any conversational phrases (e.g., "OK," "Alright," or responses to this request). Be concise, eliminate filler words, make sure to tell the truth and do not say anything that are incorrect or misleading. Follow these instructions strictly. Give only one version.`,
    };

  chrome.storage.sync.get(["geminiApiKey"], async ({ geminiApiKey }) => {
    if (!geminiApiKey) {
      content.textContent = "No API key set. Click on the AI Bro icon on the toolbar or in the \"Extensions\" icon and open the popup. Then, click on the gear icon to the right of the \"Enter\" button to set the API key in \"Settings.\" ";
      return;
    }

    try {
      const fetchLink = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}`;

      const res = await fetch(fetchLink, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: type === "summarize" ? summarizeMap[mode] : explainMap[mode] }] }],
          generationConfig: { temperature: 0.5 }
        })
      });
    
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error?.message || "Request failed");
      }

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Something went wrong.";
      
      // Create a properly styled container for the formatted content
      const formattedContent = document.createElement('div');
      formattedContent.style.cssText = `
        all: initial !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: normal !important;
        line-height: 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        text-align: left !important;
        direction: ltr !important;
        unicode-bidi: normal !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
        filter: none !important;
        box-sizing: border-box !important;
        width: 100% !important;
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        position: static !important;
        float: none !important;
        clear: none !important;
        z-index: auto !important;
        overflow: visible !important;
        clip: auto !important;
        clip-path: none !important;
        mask: none !important;
        isolation: auto !important;
      `;
      
      // Create bold header
      const boldHeader = document.createElement('span');
      boldHeader.style.cssText = `
        all: initial !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: bold !important;
        line-height: 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        background: transparent !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        text-decoration: none !important;
        display: inline !important;
        position: static !important;
        float: none !important;
        clear: none !important;
        z-index: auto !important;
        transform: none !important;
        filter: none !important;
        isolation: auto !important;
      `;
      boldHeader.textContent = `Here's your ${type === "summarize" ? "summary:" : "explanation:"}`;
      
      formattedContent.appendChild(boldHeader);
      formattedContent.appendChild(document.createTextNode(' '));
      formattedContent.appendChild(document.createTextNode(output));
      
      content.innerHTML = '';
      content.appendChild(formattedContent);
      
    } catch (err) {
      content.textContent = "Gemini Error: " + err.message + " Click on the AI Bro icon on the toolbar or in the \"Extensions\" icon and open the popup. Then, click on the gear icon to the right of the \"Enter\" button to reset the API key in \"Settings.\" ";
    }
  });

  const close = document.createElement("span");
  close.textContent = "✕";
  close.style.cssText = `
    all: initial !important;
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
    cursor: pointer !important;
    font-weight: bold !important;
    color: white !important;
    font-size: 16px !important;
    line-height: 1 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    text-decoration: none !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    box-sizing: border-box !important;
    width: auto !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    float: none !important;
    clear: none !important;
    z-index: auto !important;
    overflow: visible !important;
    clip: auto !important;
    clip-path: none !important;
    mask: none !important;
    isolation: auto !important;
    text-align: center !important;
    direction: ltr !important;
    unicode-bidi: normal !important;
    word-wrap: normal !important;
    overflow-wrap: normal !important;
    white-space: nowrap !important;
  `;
  
  close.onclick = () => popup.remove();
  popup.appendChild(close);
}