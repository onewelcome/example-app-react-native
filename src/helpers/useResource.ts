import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import OnewelcomeSdk, {Types} from 'onewelcome-react-native-sdk';
import {useErrorHandling} from './useErrorHandling';

const fetchResource = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<any>>,
  setData: Dispatch<SetStateAction<any>>,
  logoutOnInvalidToken: (e: unknown) => void,
  shouldAuthenticate: boolean,
  type: Types.ResourceRequestType,
  resourceDetails: Types.ResourcesDetails,
  scopes?: string[],
  profileId: string | null = null,
) => {
  // when type is ResourceRequestType.Implicit we require profileId
  if (type === Types.ResourceRequestType.Implicit && !profileId) {
    return;
  }

  try {
    if (shouldAuthenticate) {
      if (type === Types.ResourceRequestType.Implicit && profileId) {
        await OnewelcomeSdk.authenticateUserImplicitly(profileId, scopes);
      } else if (type === Types.ResourceRequestType.Anonymous) {
        await OnewelcomeSdk.authenticateDeviceForResource(scopes);
      }
    }
    const baseUrl = await OnewelcomeSdk.getResourceBaseUrl();
    const data = await OnewelcomeSdk.resourceRequest(type, {
      ...resourceDetails,
      path: baseUrl + resourceDetails.path,
    });
    setData(data.body);
    setLoading(false);
  } catch (e) {
    logoutOnInvalidToken(e);
    console.error('fetchResource error = ', e);

    setError(e);
    setLoading(false);
  }
};

//

function useResources(
  type: Types.ResourceRequestType,
  details: Types.ResourcesDetails,
  shouldAuthenticate: boolean,
  scopes?: string[],
  profileId?: string | null,
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const {logoutOnInvalidToken} = useErrorHandling();

  // get initial details - to prevent from rerender
  const [currentDetails, setCurrentDetails] = useState(details);

  // if details has changed
  useEffect(() => {
    if (JSON.stringify(details) !== JSON.stringify(currentDetails)) {
      setCurrentDetails(details);
    }
  }, [details, currentDetails]);

  useEffect(() => {
    fetchResource(
      setLoading,
      setError,
      setData,
      logoutOnInvalidToken,
      shouldAuthenticate,
      type,
      currentDetails,
      scopes,
      profileId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, shouldAuthenticate, profileId, currentDetails]);

  return {
    loading,
    data,
    error,
  };
}

export {useResources};
