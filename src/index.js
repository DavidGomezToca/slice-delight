import "./index.css"
import Swal from "sweetalert2"
import ReactDom from "react-dom/client"
import PizzaData from "./data/pizzaData.json"
import AppProviders from "./providers/AppProviders"
import React, { useState, useContext } from "react"
import SocialMediaData from "./data/socialMediaData.json"
import { TranslationsContext } from "./contexts/TranslationsContext"

/**
 * @component App.
 * @returns {JSX.Element} - The App component.
 */
function App() {
    /**
     * Translations context.
     * @type {{object}}.
     */
    const { language, translations, changeLanguage } = useContext(TranslationsContext)

    /**
     * Texts translated.
     * @type {object}.
     */
    const texts = translations

    /**
     * Initial order list.
     * @type {object}.
     */
    const initialOrder = new Array(PizzaData.pizzas.length)
    PizzaData.pizzas.forEach(element => {
        initialOrder[element.id] = ([element.name, element.price, 0])
    })

    /**
     * Order list.
     * @type {object, function}.
     */
    const [order, setOrder] = useState(initialOrder)

    return (
        <div className="container">
            <Header />
            <Menu texts={texts} language={language} order={order} setOrder={setOrder} />
            <Footer texts={texts} order={order} language={language} changeLanguage={changeLanguage} />
        </div>
    )
}

/**
 * @component Header.
 * @returns {JSX.Element} - The Header component.
 */
function Header() {
    /**
     * App name.
     * @type {string}.
     */
    let appName = require("../package.json").name
    appName = appName.split("-")[0] + " " + appName.split("-")[1]

    return (
        <header className="header">
            <h1>{appName}</h1>
        </header>
    )
}

/**
 * @component Menu.
 * @param {object} texts - The texts translated.
 * @param {string} language - The language.
 * @param {object} order - The order list.
 * @param {function} setOrder - Updates the order list.
 * @returns {JSX.Element} - The Menu component.
 */
function Menu({ texts, language, order, setOrder }) {
    /**
     * Pizzas list.
     * @type {object}.
     */
    const pizzas = PizzaData.pizzas

    return (
        <main className="menu">
            <h2>{texts[0]}</h2>
            {pizzas.length > 0 ? (
                <>
                    <p>{texts[1]}</p>
                    <ul className="pizzas">{pizzas.map((pizza) => (<Pizza texts={texts} language={language} pizza={pizza} key={pizza.name} order={order} setOrder={setOrder} />))}</ul>
                </>
            ) : (
                <p>{texts[2]}</p>
            )}
        </main>
    )
}

/**
 * @component Pizza.
 * @param {object} texts - The texts translated.
 * @param {string} language - The language.
 * @param {object} pizza - The pizza.
 * @param {object} order - The order list.
 * @param {function} setOrder - Updates the order list.
 * @returns {JSX.Element} - The Pizza component.
 */
function Pizza({ texts, language, pizza, order, setOrder }) {
    return (
        <li className={`pizza ${pizza.soldOut ? "sold-out" : ""}`}>
            <img className="pizzaImg" src={pizza.photoName} alt={pizza.name}></img>
            <div className="pizzaDiv">
                <h3>{pizza.name}</h3>
                <p>{pizza.ingredients[language]}</p>
                {pizza.soldOut ? (
                    <span>{texts[3]}</span>
                ) : (
                    <>
                        <div className="orderButtons">
                            <img className={`orderButton ${order[pizza.id][2] === 0 ? "orderButtonDisabled" : ""}`} src="ui/minus_button.png" alt="Minus Button" onClick={() => UpdateCantityOrder(pizza.id, -1, order, setOrder)}></img>
                            <span className="orderCantity">{order[pizza.id][2]}</span>
                            <img className="orderButton" src="ui/plus_button.png" alt="Plus Button" onClick={() => UpdateCantityOrder(pizza.id, 1, order, setOrder)}></img>
                        </div>
                        <span className="pizzaSpan">{pizza.price}€</span>
                    </>
                )}
            </div>
        </li>
    )
}

/**
 * Update the cantity of a pizza in the order list.
 * @param {number} id - The ID of the pizza.
 * @param {number} value - The value to add or subtract.
 * @param {object} order - The order list.
 * @param {function} setOrder - Updates the order list.
 */
function UpdateCantityOrder(id, value, order, setOrder) {
    // Avoid negative quantities.
    if (0 <= order[id][2] + value) {
        const newOrder = order.map((item, index) => {
            // Update the quantity of the pizza.
            if (index === id)
                return [...item.slice(0, 2), item[2] + value, ...item.slice(3)]
            return [...item]
        })
        // Update the order list.
        setOrder(newOrder)
    }
}

/**
 * @component Footer.
 * @param {object} texts - The texts translated.
 * @param {string} language - The language.
 * @param {function} changeLanguage - Changes the language.
 * @param {object} order - The order list.
 * @returns {JSX.Element} - The Footer component.
 */
function Footer({ texts, language, changeLanguage, order }) {
    return (
        <footer className="footer">
            <Order texts={texts} order={order} />
            <LanguageFlag language={language} changeLanguage={changeLanguage} />
            <SocialMedia />
        </footer>
    )
}


/**
 * @component Order.
 * @param {object} texts - The texts translated.
 * @param {object} order - The order list.
 * @returns {JSX.Element} - The Order component.
 */
function Order({ texts, order }) {
    /**
     * Current hour.
     * @type {number}.
     */
    const currentHour = new Date().getHours()

    /**
     * Start hour of the offer.
     * @type {number}.
     */
    const startOffer = 12

    /**
     * End hour of the offer.
     * @type {number}.
     */
    const endOffer = 20

    /**
     * Check if the offer is active.
     * @type {boolean}.
     */
    const offerActive = currentHour >= startOffer && currentHour <= endOffer

    return (
        <div className="order">
            <p>{texts[4]} {startOffer}:00 {texts[5]} {endOffer}:00. {texts[6]}</p>
            <button className="btn" onClick={() => {
                let htmlOrder = ""
                let totalPrice = 0
                order.forEach(element => {
                    if (element[2] > 0) {
                        htmlOrder = htmlOrder + "<p>" + element[0] + ": " + element[2] + "</p>"
                        totalPrice += (element[1] * element[2])
                    }
                })
                if (totalPrice > 0) {
                    let htmlTotalPrice = ""
                    if (offerActive) {
                        totalPrice *= 0.8
                        totalPrice = Number(totalPrice.toFixed(2))
                        htmlTotalPrice = texts[7] + totalPrice + "€"
                    }
                    else
                        htmlTotalPrice = texts[8] + totalPrice + "€"
                    Swal.fire({
                        title: htmlTotalPrice,
                        html: htmlOrder,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: texts[9],
                        cancelButtonText: texts[10],
                        customClass: {
                            htmlContainer: "swal2-text",
                            confirmButton: "swal2-text",
                            cancelButton: "swal2-text",
                            popup: "swal2-popup"
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: texts[11],
                                text: texts[12],
                                icon: "success",
                                customClass: {
                                    htmlContainer: "swal2-text",
                                    popup: "swal2-popup",
                                    confirmButton: "swal2-text"
                                }
                            })
                        }
                    })
                } else {
                    Swal.fire({
                        title: texts[13], html: "", icon: "info",
                        customClass: {
                            htmlContainer: "swal2-text",
                            confirmButton: "swal2-text",
                            popup: "swal2-popup"
                        }
                    })
                }
            }}>{texts[14]}</button>
        </div>
    )
}

/**
 * @component LanguageFlag.
 * @param {string} language - The language.
 * @param {function} changeLanguage - Changes the language.
 * @returns {JSX.Element} - The Footer component.
 */
function LanguageFlag({ language, changeLanguage }) {
    return (
        <img className="language-flag" src={`flags/${language}.png`} alt={`Language Flag ${language}`} onClick={() => changeLanguage()} />
    )
}

/**
 * @component SocialMedia.
 * @returns {JSX.Element} - The Social Media component.
 */
function SocialMedia() {
    /**
     * Social Medias List.
     * @type {object}.
     */
    const socialMedias = SocialMediaData.socialMedias

    return (
        <div className="social-media">
            {socialMedias.map((socialMedia) => (
                <SocialMediaIcon key={`social-media-${socialMedia.name}`} url={socialMedia.url} icon={socialMedia.icon} />
            ))}
        </div>
    )

    /**
     * @component Social Media Icon.
     * @param {string} url - The URL of the social media.
     * @param {string} icon - The icon of the social media.
     * @returns {JSX.Element} - The Social Media Icon component.
     */
    function SocialMediaIcon({ url, icon }) {
        return (
            <a className="icon" href={url} target="_blank" rel="noreferrer">
                <i className={icon} />
            </a>
        )
    }
}

/**
 * Entry point of the application.
 * - Renders the main App component to the root DOM element.
 * - Wraps the App component in React.StrictMode to enable additional checks and warnings.
 * @function render
 */
const root = ReactDom.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </React.StrictMode>
)