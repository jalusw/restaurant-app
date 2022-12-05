import "regenerator-runtime"; /* for async await transpile */
import "./styles/index.scss";

import data from "./data/DATA.json";

const filterRestaurants = {
  minRating: 0,
  maxRating: 5,
  cities: {},
  isCityIncluded: false,
  search: "",
};

const generateRestaurantElement = (restaurant) => {
  const restaurantElement = document.createElement("article");
  restaurantElement.classList.add("card");
  restaurantElement.innerHTML = `
    <img class="card__image" src="${restaurant.pictureId}" width="100%" height="250" loading="async" alt=""/>
    <div class="flex align-center justify-between">
      <h2 class="card__title card__title--restaurant">${restaurant.name}</h2>
      <div class="flex align-start">
        <i class="icon icon--sm icon--star mr-1"></i>
        <span>${restaurant.rating}</span>
      </div>
    </div>
    <p class="flex mt-2 gap-2">
      <i class="icon icon--sm icon--pin"></i>
      ${restaurant.city}
    </p>
    <p class="card__text card__text--restaurant">${restaurant.description}</p>
    <a class="btn btn--outline-primary mt-5" href="#">
      <span>Detail</span>
    </a>
    `;
  return restaurantElement;
};

const generateFilterCityElement = (city) => {
  const checkboxWrapper = document.createElement("label");
  const checkbox = document.createElement("input");
  const text = document.createElement("span");
  checkboxWrapper.classList.add(
    "btn",
    "btn--transparent",
    "border-primary-sm",
    "rounded-md"
  );
  checkboxWrapper.setAttribute("for", `checkbox-${city}`);
  checkbox.classList.add("filter-city", "mr-3");
  checkbox.setAttribute("id", `checkbox-${city}`);
  checkbox.setAttribute("data-city", city);
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("aria-checked", "false");

  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      e.target.setAttribute("aria-checked", "true");
    } else {
      e.target.setAttribute("aria-checked", "false");
    }
    checkboxWrapper.classList.toggle("bg-primary");
    text.classList.toggle("text-white");
  });
  text.textContent = city;
  checkboxWrapper.appendChild(checkbox);
  checkboxWrapper.appendChild(text);
  return checkboxWrapper;
};

const renderRestaurantsWithFilter = (wrapper, restaurants) => {
  wrapper.innerHTML = "";
  const regexPattern = new RegExp(`.*${filterRestaurants.search}.*`, "i");
  debugger;
  for (let restaurant of restaurants) {
    if (
      regexPattern.test(restaurant.name) &&
      restaurant.rating >= filterRestaurants.minRating &&
      restaurant.rating <= filterRestaurants.maxRating &&
      (!filterRestaurants.isCityIncluded ||
        filterRestaurants.cities[restaurant.city])
    ) {
      wrapper.appendChild(generateRestaurantElement(restaurant));
    }
  }
};

const mergeSortWithKey = (arr, key) => {
  if (arr.length == 1) return arr;
  if (arr.length == 2)
    return arr[0][key] < arr[1][key] ? [arr[0], arr[1]] : [arr[1], arr[0]];

  const halfArr = parseInt(arr.length / 2);
  const leftArr = mergeSortWithKey(arr.slice(0, halfArr), key);
  const rightArr = mergeSortWithKey(arr.slice(halfArr), key);

  let leftPointer = 0;
  let rightPointer = 0;
  const sorted = [];

  while (leftPointer < leftArr.length && rightPointer < rightArr.length) {
    if (leftArr[leftPointer][key] <= rightArr[rightPointer][key]) {
      sorted.push(leftArr[leftPointer]);
      leftPointer++;
    } else {
      sorted.push(rightArr[rightPointer]);
      rightPointer++;
    }
  }
  for (let i = leftPointer; i < leftArr.length; i++) {
    sorted.push(leftArr[i]);
  }
  for (let i = rightPointer; i < rightArr.length; i++) {
    sorted.push(rightArr[i]);
  }

  return sorted;
};

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
