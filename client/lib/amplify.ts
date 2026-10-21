
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_waru5q9eZ",
      userPoolClientId: "1ucr4810a49r6db220bhkc519r",
    },
  },
});
