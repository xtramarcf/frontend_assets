import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

/**
 * Definition for assets.
 */
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

/**
 * Default asset instance.
 */
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

/**
 * Definition for documents.
 */
export interface Document {
  id: number;
  docName: string;
  content: string;
  asset: number
}
