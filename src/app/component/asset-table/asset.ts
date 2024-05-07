import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

export interface Asset {
  id?: number | null;
  itemType: string;
  name: string;
  description: string;
  owner: string;
  paymentType: string;
  price: number;
  lendable: boolean;
  borrowedAt: NgbDate;
  returnAt: NgbDate;
  docs: Document[] | null;
}

export const defaultAsset: Asset = {
  id: null,
  itemType: 'DEVICE',
  name: '',
  description: '',
  owner: '',
  paymentType: 'PURCHASED',
  price: 9.99,
  lendable: true,
  borrowedAt: new NgbDate(2024, 1, 1),
  returnAt: new NgbDate(2024, 1, 1),
  docs: null
};

export interface Document {
  id: number;
  docName: string;
  content: string;
  asset: number
}
