// ----------------------------------------------- UserData Type --------------
export interface UserDataType {
  token: string;
  user_type: string;
  chapter: {
    name: string;
    id: number;
  };
  council: {
    name: string;
    id: number;
    chapter: {
      name: string;
      id: number | null;
    } | null;
  }[];
  commitee: {
    name: string;
    id: number;
  }[];
  userSecret: string;
  userName: string;
  user_id: number;
  member_id: number;
  has_updated: boolean;
  profile_image: string;
}

//  ---------------------------------------- Types of data-----------------------
type NewsParagraphItem = {
  id: number;
  paragraph: string;
  heading: string;
};

type NewsDataItem = {
  id: number;
  paragraphs: NewsDataItem[];
  has_reacted: boolean;
  name: string;
  is_exco: boolean;
  is_committee: boolean;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  likes: number | null;
  dislikes: number | null;
  body: string;
  image: string;
  danload: string | null;
  committee_name: string | null;
  chapters: string | null;
  user_that_have_reacted: any[]; // Replace with the correct type
};

export type NewsResponseType = {
  message: string;
  status_code: number;
  data: DataItem[];
  success: boolean;
};

// -------------------------------------------- NewsComments-------------------------------
export type NewsCommentProps = {
  newsId: number;
};

// Define types for comments
export type Comment = {
  id: number;
  comment: string;
  member: {
    full_name: string;
    photo_url?: string;
    id: number;
  };
};

interface NewsCommentDetails {
  id: number;
  paragraphs: any;
  name: string;
  is_exco: boolean;
  is_committe: boolean;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  likes: number;
  dislikes: number | null;
  body: string;
  image: string;
  danload: string | null;
  exco: string | null;
  commitee_name: string | null;
  chapters: string | null;
  membership_grade: string | null;
  newsId: number;
}

// -------------------------------------------- Events-------------------------------

export interface EventDataType {
  id: number;
  image: string;
  name: string;
  is_paid_event: boolean;
  re_occuring: boolean;
  is_virtual: boolean;
  commitee_id: number | null;
  exco_id: number | null;
  amount: string; // Consider using a more specific numeric type if possible
  is_active: boolean;
  startDate: string; // Consider using Date type
  startTime: string; // Consider using Time type
  scheduletype: string; // Replace with an enum or specific type if available
  schedule: string[]; // Consider using a more specific type
  event_access: {
    has_paid: boolean;
    link: string;
  };
  organiser_extra_info: string;
  organiser_name: string;
  event_extra_details: string;
  event_docs: string;
  organiserImage: string | null;
  is_special: boolean;
}

//----------------------------- Table Type
export interface TableDataType {
  id: number;
  user__email: string;
  is_overdue: boolean;
  amount: string;
  is_paid: boolean;
  due__startDate: string;
  due__Name: string;
  customAccessorProperty: string;
}

// ---------------------------- Publications

export interface PublicationParagraphType {
  id: number;
  paragragh: string;
  heading: string;
}

export interface PublicationDataType {
  id: number;
  paragraphs: PublicationParagraphType[];
  name: string;
  is_exco: boolean;
  is_committe: boolean;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  likes: number;
  dislikes: number | null;
  body: string;
  image: string;
  danload: string | null;
  exco: string | null;
  commitee_name: string | null;
  chapters: string | null;
  membership_grade: string | null;
  newsId: number;
}

//  Excos Members

interface ExcoMemberInfoType {
  id: number;
  name: string;
  value: string | null;
  member_id: number;
}

interface ExcoMemberDataType {
  id: number;
  member_info: MemberInfoType[];
  exco_info: any[]; // You can specify a type if needed
  is_active: boolean;
  email: string;
  photo: string;
  member_education: any[]; // You can specify a type if needed
  member_employment_history: any[]; // You can specify a type if needed
  full_name: string;
  amount_owing: string;
  is_exco: boolean;
  is_financial: boolean;
  alumni_year: string;
  telephone_number: string;
  address: string;
  dob: string | null; // You can specify a more specific type for date
  citizenship: string;
  has_updated: boolean;
  bio: string;
  user: number;
}

// Election Position Datatype
export interface ElectionPositionDataType {
  id: number;
  name: string;
  role_name: string;
  role_detail: string;
  is_close: boolean;
  election_startDate: string | null;
  election_endDate: string | null;
  election_endTime: string | null;
  election_startTime: string | null;
}

// User Profile Types

interface MoreInfoAboutProfileDataType {
  value: string | number | boolean;
  name: string;
  id: number;
}

export interface UserProfileDataType {
  amount_owing: number;
  is_exco: boolean;
  member_id: number;
  is_financial: boolean;
  more_info: MoreInfoAboutProfileDataType[];
}

//  Fund a Project

interface FundAProjectDataType {
  heading: string;
  about: string;
  id: number;
  image: string;
  what_project_needs: string[];
}

// chat user type

export interface ChatUserDataType {
  id: number;
  email: string;
}

export interface ChatMessageDataType {
  message: string;
  user__id: number;
  full_name: string;
  id?: number;
}

// ----------------------------------- Notifications

export interface NotificationDataType {
  audience: string[];
  createdAt: string;
  title: string;
  message: string;
}

export interface Props {
  notificationItem: NotificationDataType;
}
//-------Contact Us --------

export interface SupportData {
  name: string;
  email: string;
  message: string;
}
