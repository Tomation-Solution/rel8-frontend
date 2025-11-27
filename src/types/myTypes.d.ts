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


export interface MemberInfoType {
  id: number;
  name: string;
  email: string;
  phone: string;
  orgId: string;
  profile_image?: string;
  exco: {
    isExco: boolean;
    position: string | null;
  };
  committee: {
    isMember: boolean;
    committeeName: string | null;
    committeeId: string | null;
    position: string | null;
  };
  token: string;
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
  data: NewsCommentDetails[];
  success: boolean;
};

export type EventsResponseType = {
  message: string;
  status_code: number;
  data: EventDataType[];
  success: boolean;
};

// -------------------------------------------- NewsComments-------------------------------
export type NewsCommentProps = {
  newsId: string;
  comments: any
}

// Define types for comments
export type Comment = {
  id: number;
  content: string;
  memberId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NewsCommentDetails {
  _id: string;
  id: string;
  topic: string;
  bannerUrl: string;
  content: string;
  audience: string;
  orgId: string;
  comments: Comment[];
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
  // For compatibility with existing UI
  name?: string;
  body?: string;
  image?: string;
  updated_at?: string;
  likes_count?: number;
  dislikes?: number;
}



// -------------------------------------------- Events-------------------------------

export interface EventDataType {
  _id: string;
  bannerUrl: string;
  details: string;
  address: string;
  meetingLink: string;
  audience: string;
  date: string;
  time: string;
  organizer: string;
  isPaid: boolean;
  price: number;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  id: string;
  image: string;
  name: string;
  is_paid_event: boolean;
  re_occuring: boolean;
  is_virtual: boolean;
  commitee_id: number | null;
  exco_id: number | null;
  amount: string;
  is_active: boolean;
  startDate: string;
  startTime: string;
  scheduletype: string;
  schedule: string[];
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
  _id: string;
  user__email: string;
  is_overdue: boolean;
  amount: string;
  is_paid: boolean;
  startDate: string;
  status: string;
  purpose: string;
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
  bannerUrl?: string;
  attachmentUrls?: string[];
  exco: string | null;
  commitee_name: string | null;
  chapters: string | null;
  membership_grade: string | null;
  comments: any;
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
  name: string;

}

export interface ChatMessageDataType {
  message: string;
  user__id: number | string;
  full_name: string;
  time?: string;
  id?: number;
  _id?: number;
}

// ----------------------------------- Notifications

export interface NotificationDataType {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  latest_update_table_name: string;
  latest_update_table_id: number;
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