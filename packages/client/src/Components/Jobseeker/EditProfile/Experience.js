import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';

function Experience() {
  const [experience, setExperience] = useState([]);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateFail, setIsUpdateFail] = useState(false);

  const { register, setValue, control, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const fetchInfo = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data.user;
  };
  const onSubmitForm = async (data) => {
    const uniqueData = data.experience.reduce(
      (items, item) =>
        items.find(
          (x) => x.jobTitle.toLowerCase() === item.jobTitle.toLowerCase(),
        )
          ? [...items]
          : [...items, item],
      [],
    );
    data.experience = uniqueData;
    setExperience(uniqueData);
    const res = await fetch(`/api/applicant/experience`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res.status === 200) {
      setIsUpdateSuccess(true);
    } else {
      setIsUpdateFail(true);
    }
  };
  useEffect(() => {
    const getInfo = async () => {
      const info = await fetchInfo();
      setExperience(info.experience);
    };
    getInfo();
  }, []);

  useEffect(() => {
    setValue('experience', experience);
  }, [setValue, experience]);

  return (
    <div className="my-2">
      <h3>Experience</h3>
      <div className="m-auto mb-2">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="experience">
            {fields.map((item, index) => (
              <div className="row mb-1" key={item.id}>
                <div className="col-lg-4 mb-1">
                  <input
                    {...register(`experience.${index}.jobTitle`)}
                    className="form-control"
                    type="text"
                    id={`jobTitle${index}`}
                    placeholder="Job Title"
                    required
                  />
                </div>
                <div className="col-lg-4 mb-1">
                  <input
                    {...register(`experience.${index}.company`)}
                    className="form-control"
                    type="text"
                    id={`company${index}`}
                    placeholder="Company"
                    required
                  />
                </div>
                <div className="col-lg-2 mb-1">
                  <input
                    {...register(`experience.${index}.years`)}
                    className="form-control"
                    type="number"
                    min="0"
                    id={`years${index}`}
                    placeholder="Years"
                    required
                  />
                </div>
                <div className="col-lg-2 mb-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-danger col-2"
                    onClick={() => {
                      remove(index);
                      setIsUpdateFail(false);
                      setIsUpdateSuccess(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="message my-2 text-center">
            {isUpdateSuccess && (
              <p className="text-success">Updated Successfully</p>
            )}
            {isUpdateFail && <p className="text-danger">Update Failed</p>}
          </div>
          <div className="d-grid gap-2 m-auto mt-4">
            <button
              className="btn btn-secondary btn-md"
              type="button"
              onClick={() => {
                append({ jobTitle: '', company: '', years: '' });
                setIsUpdateFail(false);
                setIsUpdateSuccess(false);
              }}
            >
              Add
            </button>
            <button type="submit" className="btn btn-success btn-md">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Experience;
