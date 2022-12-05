import "regenerator-runtime"; /* for async await transpile */
import "./styles/index.scss";

import data from "./data/DATA.json";
import {
  filterRestaurants,
  generateRestaurantElement,
  generateFilterCityElement,
  renderRestaurantsWithFilter,
  mergeSortWithKey,
} from "./utils";

document.addEventListener("DOMContentLoaded", () => {
  const navMenu = document.getElementById("nav-menu");
  const btnShowNavMenu = document.getElementById("btn-show-nav-menu");
  const btnHideNavMenu = document.getElementById("btn-hide-nav-menu");

  const listRestaurantTopRated = document.getElementById(
    "list-restaurant-top-rated"
  );
  const listRestaurant = document.getElementById("list-restaurant");
  const restaurants = data.restaurants;
  const sortedRestaurants = mergeSortWithKey(restaurants, "rating");

  const formSearch = document.getElementById("form-search");
  const formFilter = document.getElementById("form-filter");
  const filterCities = document.getElementById("filter-cities");
  const btnToggleFilter = document.getElementById("btn-toggle-filter");

  const filterRatingMinimum = document.getElementById("filter-rating-min");
  const filterRatingMaximum = document.getElementById("filter-rating-max");

  btnShowNavMenu.addEventListener("click", () => {
    navMenu.classList.toggle("nav__links--show");
  });
  btnHideNavMenu.addEventListener("click", () => {
    navMenu.classList.toggle("nav__links--show");
  });

  for (
    let i = sortedRestaurants.length - 1;
    i >= sortedRestaurants.length - 3;
    i--
  ) {
    listRestaurantTopRated.appendChild(
      generateRestaurantElement(sortedRestaurants[i])
    );
  }

  for (let restaurant of data.restaurants) {
    listRestaurant.appendChild(generateRestaurantElement(restaurant));
  }

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = document.getElementById("input-search").value;
    filterRestaurants.search = searchValue;
    renderRestaurantsWithFilter(listRestaurant, restaurants);
  });

  btnToggleFilter.addEventListener("click", () => {
    formFilter.classList.toggle("hidden");
  });

  formFilter.addEventListener("submit", (e) => {
    e.preventDefault();
    filterRestaurants.minRating = Number(filterRatingMinimum.value);
    filterRestaurants.maxRating = Number(filterRatingMaximum.value);
    const filterCities = document.getElementsByClassName("filter-city");
    for (let filterCity of filterCities) {
      filterRestaurants.cities[filterCity.getAttribute("data-city")] =
        filterCity.getAttribute("aria-checked") === "true";
      filterRestaurants.isCityIncluded =
        filterRestaurants.isCityIncluded ||
        filterCity.getAttribute("aria-checked") === "true";
    }
    renderRestaurantsWithFilter(listRestaurant, restaurants);
  });

  const cities = [
    "Medan",
    "Bali",
    "Ternate",
    "Malang",
    "Surabaya",
    "Aceh",
    "Jakarta",
    "Bandung",
  ];

  for (let city of cities) {
    filterCities.appendChild(generateFilterCityElement(city));
  }
});
