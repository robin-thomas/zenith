export interface AdvertisementProps {
  open: boolean;
  handleClose: () => void;
  onYes: () => void;
  content?: string;
};
