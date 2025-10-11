import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bookmark } from "../types";

const KEY = "BOOKMARKS";

export async function saveBookmark(item: Bookmark) {
  const data = await AsyncStorage.getItem(KEY);
  const list: Bookmark[] = data ? JSON.parse(data) : [];
  list.push(item);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}