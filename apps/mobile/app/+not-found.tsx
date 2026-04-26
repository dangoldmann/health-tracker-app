import { Link } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";

export default function NotFoundScreen() {
  return (
    <Screen contentClassName="items-center justify-center gap-4 py-24">
      <View className="items-center gap-3">
        <AppText variant="title" className="text-center">
          This route is ready for the next feature.
        </AppText>
        <AppText variant="body" className="max-w-[280px] text-center">
          The mobile foundation is in place, but this screen has not been
          defined yet.
        </AppText>
      </View>

      <Link href="/" asChild>
        <Pressable className="flex-row items-center gap-2 rounded-full bg-primary px-5 py-3">
          <ArrowLeft color="#FFFFFF" size={18} />
          <AppText variant="button" className="text-white">
            Back to home
          </AppText>
        </Pressable>
      </Link>
    </Screen>
  );
}
