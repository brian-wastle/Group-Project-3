import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SINGLE_ORGANIZATION } from '../utils/queries';
import { SAVE_ORGANIZATION } from '../utils/mutations';
import { useSavedOrganizations} from '../utils/orgFunctions';

const OrganizationPage = () => {

  const { organizationId } = useParams();

  const {loading, data} = useQuery(
    GET_SINGLE_ORGANIZATION,
    {
      variables: { organizationId: organizationId },
    }
  );
  const savedOrganizations = useSavedOrganizations();
  const [saveOrganization, { organizations, orgLoading, error }] = useMutation(SAVE_ORGANIZATION);

  const organizationData = data?.getSingleOrganization||{};
  const organizationData2 = data?.getSingleOrganization._id||{};
  console.log(organizationData2)
  if (loading) {
    return <p>Still Loading...</p>
  }




  const handleSaveOrganization = async (orgId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      const saveOrganizationInput = {
        _id: organizationData._id,
        name: organizationData.name,
        description: organizationData.description ,
        image: organizationData.image ,
        link: organizationData.link
      }
      
      const {data} = await saveOrganization({
        variables: { input: {...saveOrganizationInput} },
      });

    } catch (err) {
      console.error(err);
    }

  };

  const testing = savedOrganizations.some(organization => organization._id === organizationData2)
 

  console.log(testing)

  return (
    <>
    <button></button>
      <div>
        <p>{organizationData.name}</p>
        <p>
          {organizationData.tags.length
            ? 
            organizationData.tags.map((tag) => {
            return (tag.name)
            })
            : 'Tags:'}
        </p>
        <p><img src={organizationData.image} alt="organization profile image" /></p>
        <p>{organizationData.description}</p>
        <a href={organizationData.link} target="_blank" rel="noopener noreferrer">{organizationData.link}</a>
      </div>

      <button
        disabled={savedOrganizations.some(organization => organization._id === organizationData._id)}
        className='btn-block btn-info'
        onClick={() => handleSaveBook(book.bookId)}>
        {savedOrganizations?.some(organization => organization._id === organizationData._id)
          ? 'Organization is Saved in your Profile'
          : 'Save Organization to Profile!'}
      </button>
        
        </>
  );
};

export default OrganizationPage;
