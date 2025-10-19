import { Link } from 'react-router-dom';
import { Person } from '../../types';

interface PersonLinkProps {
  name?: string | null;
  people: Person[];
}

export const PersonLink: React.FC<PersonLinkProps> = ({ name, people }) => {

  if (!name) {
    return <span>-</span>;
  }


  const person = people.find(p => p.name === name);


  if (!person) {
    return <span>{name}</span>;
  }


  const className = person.sex === 'f' ? 'has-text-danger' : '';

  return (
    <Link to={`/people/${person.slug}`} className={className}>
      {person.name}
    </Link>
  );
};
