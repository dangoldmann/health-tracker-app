import {
  ActivityIndicator as ReactNativeActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import type { ActivityIndicatorProps } from "react-native";

export function ActivityIndicator({
  color = "#0F766E",
  ...props
}: ActivityIndicatorProps) {
  return <ReactNativeActivityIndicator color={color} {...props} />;
}

export { Pressable, ScrollView, Switch, Text, TextInput, View };
