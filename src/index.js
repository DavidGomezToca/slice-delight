import "./index.css"
import Swal from "sweetalert2"
import React, { useState } from "react"
import ReactDom from "react-dom/client"
import PizzaData from "./pizzaData.json"
import SocialMediaData from "./data/socialMediaData.json"

/**
 * @component App.
 * @returns {JSX.Element} - The App component.
 */
function App() {
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
            <Menu order={order} setOrder={setOrder} />
            <Footer order={order} setOrder={setOrder} />
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
 * @param {object} order - The order list.
 * @returns {JSX.Element} - The Menu component.
 */
function Menu(order) {
    /**
     * Pizzas list.
     * @type {object}.
     */
    const pizzas = PizzaData.pizzas

    return (
        <main className="menu">
            <h2>Our menu</h2>
            {pizzas.length > 0 ? (
                <>
                    <p>Authentic Italian cuisine. 6 creative dishes to choose from. All from our stone oven, all organic, all delicious.</p>
                    <ul className="pizzas">{pizzas.map((pizza) => (<Pizza pizza={pizza} key={pizza.name} order={order} />))}</ul>
                </>
            ) : (
                <p>We're still working on our menu. Please come back later :)</p>
            )}
        </main>
    )
}

/**
 * @component Pizza.
 * @param {object} pizza - The pizza.
 * @param {object} order - The order list.
 * @returns {JSX.Element} - The Pizza component.
 */
function Pizza({ pizza, order }) {
    return (
        <li className={`pizza ${pizza.soldOut ? "sold-out" : ""}`}>
            <img className="pizzaImg" src={pizza.photoName} alt={pizza.name}></img>
            <div className="pizzaDiv">
                <h3>{pizza.name}</h3>
                <p>{pizza.ingredients}</p>
                {pizza.soldOut ? (
                    <span>SOLD OUT</span>
                ) : (
                    <>
                        <div className="orderButtons">
                            <img className={`orderButton ${order.order[pizza.id][2] === 0 ? "orderButtonDisabled" : ""}`} src="ui/minus_button.png" alt="Minus Button" onClick={() => UpdateCantityOrder(pizza.id, -1, order)}></img>
                            <span className="orderCantity">{order.order[pizza.id][2]}</span>
                            <img className="orderButton" src="ui/plus_button.png" alt="Plus Button" onClick={() => UpdateCantityOrder(pizza.id, 1, order)}></img>
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
 */
function UpdateCantityOrder(id, value, order) {
    // Avoid negative quantities.
    if (0 <= order.order[id][2] + value) {
        const newOrder = order.order.map((item, index) => {
            // Update the quantity of the pizza.
            if (index === id)
                return [...item.slice(0, 2), item[2] + value, ...item.slice(3)]
            return [...item]
        })
        // Update the order list.
        order.setOrder(newOrder)
    }
}

/**
 * @component Footer.
 * @param {object} order - The order list.
 * @returns {JSX.Element} - The Footer component.
 */
function Footer(order) {
    return (
        <footer className="footer">
            <Order order={order} />
            <SocialMedia />
        </footer>
    )
}


/**
 * @component Order.
 * @param {object} order - The order list.
 * @returns {JSX.Element} - The Order component.
 */
function Order({ order }) {
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
            <p>From {startOffer}:00 to {endOffer}:00. Profit of 20% discount.</p>
            <button className="btn" onClick={() => {
                let htmlOrder = ""
                let totalPrice = 0
                order.order.forEach(element => {
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
                        htmlTotalPrice = "Special Offer -20%: " + totalPrice + "€"
                    }
                    else
                        htmlTotalPrice = "Total price: " + totalPrice + "€"
                    Swal.fire({
                        title: htmlTotalPrice,
                        html: htmlOrder,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Confirm order",
                        customClass: {
                            htmlContainer: "swal2-text",
                            confirmButton: "swal2-text",
                            cancelButton: "swal2-text",
                            popup: "swal2-popup"
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: "Order confirmed",
                                text: "Your order will soon be ready.",
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
                        title: "Your order is empty.", html: "", icon: "info",
                        customClass: {
                            htmlContainer: "swal2-text",
                            confirmButton: "swal2-text",
                            popup: "swal2-popup"
                        }
                    })
                }
            }}>Order</button>
        </div>
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
        <App />
    </React.StrictMode>
)