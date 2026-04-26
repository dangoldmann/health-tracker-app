import Svg, { Circle } from "react-native-svg";
import { View } from "react-native";

import { AppText } from "./app-text";

type StatusTone = "good" | "overdue" | "soon";

interface StatusRingProps {
  label: string;
  size?: number;
  tone: StatusTone;
}

const toneColorMap: Record<StatusTone, string> = {
  good: "#10B981",
  overdue: "#F43F5E",
  soon: "#F59E0B",
};

export function StatusRing({
  label,
  size = 72,
  tone,
}: StatusRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View className="items-center justify-center">
      <Svg height={size} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={toneColorMap[tone]}
          strokeDasharray={`${circumference * 0.78} ${circumference}`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        className="absolute items-center justify-center px-2"
        style={{ width: size - 16 }}
      >
        <AppText className="text-center font-label text-[11px] leading-4 text-textMuted">
          {label}
        </AppText>
      </View>
    </View>
  );
}
