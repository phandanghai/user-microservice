const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PHONE_VN_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export { UUID_REGEX, EMAIL_REGEX, PHONE_VN_REGEX };
