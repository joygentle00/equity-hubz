document.addEventListener('DOMContentLoaded', () => {
    // Check if the required elements for the mockup exist
    const currentPriceElement = document.getElementById('current-price');
    if (!currentPriceElement) return; // Exit if not on the hero section

    const callButton = document.getElementById('call-button');
    const putButton = document.getElementById('put-button');
    const resultsLog = document.getElementById('results-log');
    const investmentInput = document.getElementById('investment-amount');
    const chartContainer = document.getElementById('chart-container');
    
    let basePrice = 1.09540;
    
    // --- 1. SIMULATE REAL-TIME PRICE UPDATES ---
    function updatePrice() {
        const change = (Math.random() - 0.5) * 0.0001;
        basePrice = basePrice + change;
        const newPrice = basePrice.toFixed(5);
        currentPriceElement.textContent = newPrice;

        if (change > 0) {
            currentPriceElement.style.color = '#4CAF50';
        } else if (change < 0) {
            currentPriceElement.style.color = '#F44336';
        } else {
            currentPriceElement.style.color = '#f0f0f0';
        }

        const priceRange = 0.00100;
        const priceOffset = basePrice - (1.09540 - priceRange/2); 
        const chartHeight = chartContainer.clientHeight;
        let normalizedY = (priceOffset / priceRange) * chartHeight;
        normalizedY = Math.min(Math.max(normalizedY, 5), chartHeight - 5);
        
        const dot = document.createElement('div');
        dot.className = 'price-dot';
        dot.style.cssText = `
            position: absolute; 
            right: 0px; 
            top: ${chartHeight - normalizedY}px; 
            width: 5px; 
            height: 5px; 
            border-radius: 50%; 
            background-color: ${currentPriceElement.style.color};
            z-index: 50;
        `;
        chartContainer.appendChild(dot);

        const step = 2;
        Array.from(chartContainer.children).forEach(child => {
            if (child.classList.contains('price-dot')) {
                let currentRight = parseFloat(child.style.right) || 0;
                child.style.right = (currentRight + step) + 'px';
                if (currentRight + step > chartContainer.clientWidth) {
                    chartContainer.removeChild(child);
                }
            }
        });
    }

    setInterval(updatePrice, 200);

    // --- 2. TRADE EXECUTION SIMULATION ---
    function executeTrade(type) {
        const amount = parseFloat(investmentInput.value);
        const entryPrice = basePrice;
        const durationSeconds = parseInt(document.getElementById('expiry-time').value);
        
        if (isNaN(amount) || amount < 10) {
            alert("Please enter a valid investment amount (min $10).");
            return;
        }

        logResult(`✅ Trade placed: ${type} at ${entryPrice.toFixed(5)} for $${amount}. Waiting ${durationSeconds}s...`);

        const chartHeight = chartContainer.clientHeight;
        const priceRange = 0.00100;
        const priceOffset = entryPrice - (1.09540 - priceRange/2); 
        let normalizedY = (priceOffset / priceRange) * chartHeight;
        normalizedY = Math.min(Math.max(normalizedY, 5), chartHeight - 5);
        
        const entryLine = document.createElement('div');
        entryLine.className = 'entry-line';
        entryLine.style.top = `${chartHeight - normalizedY}px`;
        chartContainer.appendChild(entryLine);
        
        setTimeout(() => {
            const exitPrice = basePrice;
            let resultMessage = "";
            let isWin = false;
            
            if (type === 'CALL' && exitPrice > entryPrice) {
                isWin = true;
            } else if (type === 'PUT' && exitPrice < entryPrice) {
                isWin = true;
            }

            if (isWin) {
                const profit = amount * 0.85; 
                resultMessage = `<span style="color:#4CAF50;">🎉 WIN! Profit: $${profit.toFixed(2)}</span> (Exit: ${exitPrice.toFixed(5)})`;
            } else {
                const loss = amount;
                resultMessage = `<span style="color:#F44336;">❌ LOSS! -$${loss.toFixed(2)}</span> (Exit: ${exitPrice.toFixed(5)})`;
            }

            logResult(resultMessage);
            
            if (chartContainer.contains(entryLine)) {
                chartContainer.removeChild(entryLine);
            }
        }, durationSeconds * 1000);
    }

    callButton.addEventListener('click', () => executeTrade('CALL'));
    putButton.addEventListener('click', () => executeTrade('PUT'));

    function logResult(message) {
        const p = document.createElement('p');
        p.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        resultsLog.prepend(p);
        while (resultsLog.children.length > 10) {
            resultsLog.removeChild(resultsLog.lastChild);
        }
    }

    // --- RESPONSIVE NAVIGATION LOGIC ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksMenu = document.getElementById('nav-links-menu');

    if (menuToggle && navLinksMenu) {
        menuToggle.addEventListener('click', () => {
            navLinksMenu.classList.toggle('active');
        });
    }

    // --- TESTIMONIAL CAROUSEL LOGIC ---
    const wrapper = document.getElementById('testimonials-wrapper');
    const dotsContainer = document.getElementById('carousel-dots');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    if (wrapper && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        const slideDuration = 10000;

        function updateCarousel() {
            const offset = -currentIndex * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
            });
        }
        
        function autoSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        setInterval(autoSlide, slideDuration);
        
        if (dotsContainer) {
            dotsContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('dot')) {
                    const slideIndex = parseInt(event.target.dataset.slide);
                    if (!isNaN(slideIndex)) {
                        currentIndex = slideIndex;
                        updateCarousel();
                    }
                }
            });
        }
    }

    // --- LANGUAGE TRANSLATION LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown-option");
  const tickerText = document.querySelector(".ticker-content");
  if (!tickerText) return;
  
  const defaultText = tickerText.textContent.trim();

  dropdowns.forEach(option => {
    option.addEventListener("click", async () => {
      const selectedLang = option.getAttribute("data-value");
      const flagUrl = option.getAttribute("data-flag");
      const langAlt = option.querySelector("img").alt;

      // Update flags and labels
      const desktopTrigger = document.querySelector("#language-dropdown-desktop");
      const mobileTrigger = document.querySelector("#language-dropdown-mobile");

      if (desktopTrigger) {
        desktopTrigger.querySelector(".dropdown-flag").style.backgroundImage = `url('${flagUrl}')`;
        desktopTrigger.querySelector("span").textContent = langAlt;
      }
      if (mobileTrigger) {
        mobileTrigger.querySelector(".dropdown-flag").style.backgroundImage = `url('${flagUrl}')`;
        mobileTrigger.querySelector("span").textContent = langAlt;
      }

      // Reset to default text if English selected
      if (selectedLang === "en") {
        tickerText.textContent = defaultText;
        return;
      }

      tickerText.textContent = "Translating...";

      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(defaultText)}&langpair=en|${selectedLang}`
        );
        const data = await response.json();
        tickerText.textContent = data.responseData.translatedText || "⚠️ Translation unavailable.";
      } catch (error) {
        console.error("Translation error:", error);
        tickerText.textContent = "⚠️ Error translating text.";
      }
    });
  });
});

});

