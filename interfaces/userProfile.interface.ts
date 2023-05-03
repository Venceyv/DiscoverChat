export interface UserProfile {
  elementType: "nameTag";
  id: string;
  name: string;
  link: {
    relativePath: string; //看YILONG WANG的profile
  };
  description: string;
  image: {
    url: string;
    alt: string|"Photo of Jonathan Surasmith"; //头像
  };
};

