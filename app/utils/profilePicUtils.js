import { ASSETS } from "../config";

export const getProfilePic = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return ASSETS.DEFAULT_PROFILE_PIC;
    }
    return { uri: imageUrl };
  };