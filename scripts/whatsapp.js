initPhoneInput();
bindInputEnterToButton("message", "button");
document.querySelector("#phone").focus();
function initPhoneInput() {
    let input = document.querySelector("#phone");
    window.intlTelInput(input, {
        // any initialisation options go here
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.12/build/js/utils.js",
        preferredCountries: ["us", "gb", "il"],
        initialCountry: "auto",
        geoIpLookup: function (success) {
            // check cookies first
            let cachedCountry = localStorage.getItem("CountryForDialingCode");
            console.log("Cached Country: " + cachedCountry);
            if(cachedCountry) {
                success(cachedCountry);
                return;
            }

            getCountryCode().then(country => {
                let result = "us";
                if(country) {
                    localStorage.setItem("CountryForDialingCode", country);
                    result = country;
                }
                success(country);
            });
        },
    });
}

async function getCountryCode() {
	try {
		const response = await fetch("https://ipapi.co/country/");
		if(response.ok) {
			let country = await response.text();
			console.log("Country: " + country);
			return country;
		} else {
			throw new Error(response.statusText);
		}
	}
	catch(error) {
		console.error("getCountryCode error: " + error.message)
	}

	return null;
}

function onSubmit() {
    let input = document.querySelector('#phone');
    let iti = window.intlTelInputGlobals.getInstance(input);
    let phone = normalizePhoneNumber(iti.getNumber());
    console.log(phone);

    const urlBase = "https://wa.me/";
    let message = document.getElementById("message").value;

    let url = urlBase + phone;

    if (message) {
        url += "?text=" + message;
    }

    console.log("url: " + url);
    url = encodeURI(url); // for spaces in the message
    window.open(url, '_blank').focus();
}

function normalizePhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, ''); // keep digits only
    return phoneNumber;
}

function bindInputEnterToButton(inputId, buttonId) {
    document.querySelector(`#${inputId}`).addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        document.querySelector(`#${buttonId}`).click()
        event.preventDefault();
    });
}