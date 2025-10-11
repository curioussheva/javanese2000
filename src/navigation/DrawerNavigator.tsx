import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WebViewScreen from "../screens/WebViewScreen";
import HTMLViewerScreen from "../screens/HTMLViewerScreen";
import IndexScreen from "../screens/IndexScreen";
import { RootDrawerParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "🏠 Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: "🔖 Bookmarks",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />
       <Drawer.Screen
        name="index"
        component={HTMLViewerScreen}
        options={{
          title: "🔖 index",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
        />
     <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: " Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Index"
        component={IndexScreen}
        options={{
          title: " Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="WebView"
        component={WebViewScreen}
        options={{ drawerLabel: () => null, title: undefined, drawerItemStyle: { height: 0 } }}
      />
   </Drawer.Navigator>
  );
}