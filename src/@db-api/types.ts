
// Data Grid page
//---------------
export type SortType = 'asc' | 'desc' | undefined | null

export type tpReloadData = (sort: SortType, q: string, paginationModel: {
  page: number;
  pageSize: number;
}, column: string) => Promise<void>

export type ShopifyOrderDetails = {
  sku: string;
  name: string;
  price: string;
  orderInfo: {
    title: string;
    value: string;
  }[];
};

export const ShopifyOrderStatusList = ["new", "pending", "sent", "whatsapp-check-fail", "sms-check-fail", "failed"] as const;
export type ShopifyOrderStatus = typeof ShopifyOrderStatusList[number];

export type ShopifyGoldenRowType = {
  id: string;
  gmailMsgId: string;
  mailSubject: string;
  name: string;
  shopName: string;
  orderNumber: string;
  phone: string;
  address: string;
  isValidAddress: boolean;
  orderDetails: ShopifyOrderDetails;
  isProcessed: boolean;
  created_at: string;
  updated_at: string;
  orderStatus: string;
  messages: { messageId: string, messageTitle: string, messageBody: string }[]
}

export type MessageTemplate = {
  message: string,
  title: string,
  id: string,
}
export type ShopifyMessageTemplate = {
  scope: string,
  category: string,
  messages: MessageTemplate[]
}
export interface RelinkProductType {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  productSize: string;
  surfaceType: string;
  productQuantity: number;
  productPrice: string;
  redirectUrlType: string;
  redirectUrl: string;
  thirdLvlDomain: string;
  isActive?: boolean
}

export interface RelinkOrderRowType {
  id: string;
  orderNum: string;
  customerName: string;
  orderTotal: number;
  phone: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  isItalian: boolean;
  orderStatus: "new" | "domain-created" | "domain-creation-failed" | "sent-for-shipping" | "email-send-fail" | "failed";
  products: RelinkProductType[];
  created_at: string;
  updated_at: string;
}

export interface RelinkDomainsRowType {
  thirdLvlDomain: string,
  redirectUrl: string,
  sku: string,
  redirectType: string,
  isActive: boolean,
  created_at: string,
  updated_at: string,
  incrementalId?: number
}

export interface CustomerDomainsType {
  id: string;
  redirectUrl: string;
  thirdLvlDomain: string;
  businessUrlType?: string,
  productName?: string;
  surfaceType?: string;
  productSku?: string;
  customerId?: string
}

export interface CustomerRowType {
  incrementalId?: number;
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  aemail?: string;
  billingAddress: string;
  shippingAddress: string;
  redirectUrl: string;
  thirdLvlDomain: string;
  productName?: string,
  businessUrlType?: string,
  surfaceType?: string,
  productSku?: string,
  created_at?: string;
  updated_at?: string;
  customerId?: string
  source?: string;
  addedBy?: string;
}

export interface WarehousesRowType {
  id: string
  name: string
  email: string
  phone: string
  parsingName: string
  useLandingFlow: boolean
  isDefault: boolean
  created_at: string
  channelType: "relink" | "shopify"
}

export interface ParsingConditionRowType {
  id?: string,
  condValue?: string,
  condType?: "address" | "mail-subject" | "body",
  warehouseId?: string,
  created_at?: string;
}

export interface tpMiscSettings {
  id?: string,
  startCron?: boolean,
  scheduleIntervalInMins?: number,
  delayAfterMessageFetchInMins?: number,
  isRunning?: boolean,
  processType?: "shopify" | "relink" | "domain-creation",
  useGoogleSheets?: boolean,
  sheetsUrl?: string,
  sheetName?: string
}