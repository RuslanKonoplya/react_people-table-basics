import { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { Person } from '../../types';
import { getPeople } from '../../api';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';

export const PeoplePage = () => {
  const [isLoad, setIsLoad] = useState(true);
  const [people, setPeople] = useState<Person[] | []>([]);
  const [problemServer, setProblemServer] = useState(false);

  const { slug } = useParams();

  function findPersonByName(
    name: string | null,
    peoplee: Person[],
  ): Person | undefined {
    return peoplee.find(pers => pers.name === name);
  }

  useEffect(() => {
    getPeople()
      .then(resp => {
        setPeople(resp);
        setIsLoad(false);
      })

      .catch(() => {
        setIsLoad(false);
        setProblemServer(true);
      });
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {isLoad ? (
            <Loader />
          ) : problemServer ? (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          ) : people.length === 0 ? (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          ) : (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => {
                  const mother = findPersonByName(person.motherName, people);

                  const father = findPersonByName(person.fatherName, people);

                  return (
                    <tr
                      data-cy="person"
                      className={classNames({
                        'has-background-warning': person.slug === slug,
                      })}
                      key={person.name}
                    >
                      <td>
                        <Link
                          className={classNames({
                            'has-text-danger': person.sex === 'f',
                          })}
                          to={`/people/${person.slug}`}
                        >
                          {person.name}
                        </Link>
                      </td>

                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>

                      <td>
                        {mother ? (
                          <Link
                            to={`/people/${mother.slug}`}
                            className="has-text-danger"
                          >
                            {mother.name}
                          </Link>
                        ) : (
                          person.motherName || '-'
                        )}
                      </td>

                      <td>
                        {father ? (
                          <Link to={`/people/${father.slug}`}>
                            {father.name}
                          </Link>
                        ) : (
                          person.fatherName || '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
