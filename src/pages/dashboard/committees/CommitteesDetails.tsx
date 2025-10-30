import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCommitteeDetails } from '../../../api/committee/committee'; // Adjust the path to your API function
import CircleLoader from "../../../components/loaders/CircleLoader";

const CommitteeDetails = () => {
    const { id } = useParams<{ id: string }>(); // Ensure 'id' is treated as a string
    const { data, isLoading, error } = useQuery(['committee', id], () => fetchCommitteeDetails(id as string));
    
    if (isLoading){
        return <CircleLoader/>
      }
    if (error) return <div className="flex items-center justify-center h-screen text-error-main">Error loading committee details</div>;

    const committee = data?.data;

    return (
        <div className="bg-white shadow-md rounded-lg max-w-4xl my-8 px-5 md:px-0">
            <h2 className="text-2xl font-bold text-org-primary-blue mb-6">{committee?.name}</h2>
            <div className="relative">
                <img src={committee?.team_of_reference} alt={`${committee?.name} team`} 
                    className="w-full object-cover max-h-[40vh] top-0 bottom-0 left-0 right-0 h-auto mb-6 rounded-lg shadow-md"
                />
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-org-primary-dark1 mb-2">To-Do List:</h3>
                    <ul className="list-disc ml-6 text-neutral-1">
                        {committee?.commitee_todo.how.map((todo: string, index: number) => (
                            <li key={index} className="mb-1">{todo}</li>
                        ))}
                    </ul>
                </div>
    
                <div>
                    <h3 className="text-xl font-semibold text-org-primary-dark1 mb-2">Duties:</h3>
                    <ul className="list-disc ml-6 text-neutral-1">
                        {committee?.commitee_duties.how.map((duty: string, index: number) => (
                            <li key={index} className="mb-1">{duty}</li>
                        ))}
                    </ul>
                </div>
    
                <div>
                    <h3 className="text-xl font-semibold text-org-primary-dark1 mb-2">Connected Members:</h3>
                    <ul className="space-y-4">
                        {committee?.connected_members.length > 0 ? (
                            committee.connected_members.map((member: any, index: number) => (
                                <li key={index} className="p-4 bg-neutral-3 rounded-lg shadow-sm">
                                    <p className="font-medium text-org-primary-dark2">{member.full_name || 'Anonymous'}</p>
                                    <p className="text-neutral-1">Email: {member.email}</p>
                                    <p className="text-neutral-1">Phone: {member.telephone_number || 'N/A'}</p>
                                    <p className="text-neutral-2">Position: {member.is_exco ? 'Exco Member' : 'Member'}</p>
                                </li>
                            ))
                        ) : (
                            <li className="text-neutral-2">No members connected to this committee.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
    
};

export default CommitteeDetails;
