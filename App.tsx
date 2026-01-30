import React, { useState } from 'react';
import { SubjectId, User } from './types';
import { SUBJECTS } from './constants';
import Layout from './components/Layout';
import SubjectDashboard from './components/SubjectDashboard';
import SubjectPage from './components/SubjectPage';

const GUEST_USER: User = {
  id: 'guest',
  email: 'guest@iaprof.fr',
  displayName: 'Étudiant'
};

const App: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | null>(null);

  const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);

  return (
    <Layout 
      user={GUEST_USER} 
      onLogout={() => {}} 
      onHome={() => setSelectedSubjectId(null)}
    >
      {!selectedSubjectId ? (
        <SubjectDashboard onSelectSubject={setSelectedSubjectId} />
      ) : (
        currentSubject && (
          <SubjectPage 
            subject={currentSubject} 
            user={GUEST_USER}
            onBack={() => setSelectedSubjectId(null)} 
          />
        )
      )}
    </Layout>
  );
};

export default App;