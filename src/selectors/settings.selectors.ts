import { SettingKey } from "../reducers/settings.reducer";
import { RootState } from "../store";

export const getSetting = (state: RootState) => (key: SettingKey) =>
  state.settings[key];
