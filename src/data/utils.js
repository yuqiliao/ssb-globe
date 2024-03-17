import { csvParse, autoType } from "d3";

export async function getData(url, fetch = window.fetch) {
  let response = await fetch(url);
  let string = await response.text();
  let data = await csvParse(string, autoType);
  return data;
}

export async function getJson(url, fetch = window.fetch) {
  let response = await fetch(url);
  let json = await response.json();
  return json;
}
