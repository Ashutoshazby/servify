import React from "react";
import { Text } from "react-native";

export default function RatingStars({ rating = 0 }) {
  const stars = Array.from({ length: 5 }, (_, index) => (index < Math.round(rating) ? "★" : "☆")).join("");
  return <Text>{stars}</Text>;
}
