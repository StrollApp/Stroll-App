export default ({ config }) => {
  config.extra.apiBaseUrl = config.extra.useTestingServer
    ? "https://du5e82ziuh.execute-api.us-west-2.amazonaws.com/Prod/"
    : "https://fbxr04wyil.execute-api.us-west-1.amazonaws.com/Prod/";
  return {
    ...config
  };
};
