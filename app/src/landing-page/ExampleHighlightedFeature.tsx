import { FeatureAssets } from "../shared/assets";
import HighlightedFeature from "./components/HighlightedFeature";

export default function AIReady() {
  return (
    <HighlightedFeature
      name="Example Feature Highlight"
      description="Yo! Use this component to show off the most important features in your app."
      highlightedComponent={<AIReadyExample />}
      direction="row-reverse"
    />
  );
}

const AIReadyExample = () => {
  return (
    <div className="w-full">
      <img src={FeatureAssets.aiReady} alt="AI Ready" className="dark:hidden" />
      <img src={FeatureAssets.aiReadyDark} alt="AI Ready" className="hidden dark:block" />
    </div>
  );
};
