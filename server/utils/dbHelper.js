const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const convertEmailToId = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail }).select("-password");

    return user._id;
  } catch (error) {
    console.error(error);
  }
};

const splitName = (fullName) => {
  const splittedName = fullName.split(" ");
  const firstName = splittedName.shift();
  const lastName = splittedName.join(" ");

  return { firstName, lastName };
};

const generateRandomPassword = () => {
  const passwordLength = getRandomInt(3, 15);
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialSymbols = "!@#$";
  const numbers = "0123456789";
  const allCharacters = [
    lowercaseLetters,
    uppercaseLetters,
    specialSymbols,
    numbers,
  ].join("");
  const result = [
    chooseOneOf(specialSymbols),
    chooseOneOf(lowercaseLetters),
    chooseOneOf(uppercaseLetters),
    chooseOneOf(numbers),
  ];

  for (let i = 0; i < passwordLength; i++) {
    result.push(chooseOneOf(allCharacters));
  }

  return shuffle(result).join("")
};

const chooseOneOf = (stringOfChars) => {
  return stringOfChars.charAt(Math.floor(Math.random() * stringOfChars.length));
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = { convertEmailToId, splitName, generateRandomPassword };
