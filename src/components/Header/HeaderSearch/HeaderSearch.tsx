import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { SearchDropdown } from '../dropdowns/SearchDropdown/SearchDropdown';
import { useResponsive } from 'hooks/useResponsive';
import { componentsData, Component } from 'constants/componentsData';
import { categoriesList, CategoryType } from 'constants/categoriesList';
import * as S from './HeaderSearch.styles';

export interface CategoryComponents {
  category: CategoryType;
  components: Component[];
}

export const HeaderSearch: React.FC = () => {
  const { mobileOnly, isTablet } = useResponsive();

  const history = useHistory();

  const [query, setQuery] = useState('');
  const [components] = useState<Component[]>(componentsData);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const sortedResults = query
    ? categoriesList.reduce((acc, current) => {
        const searchResults = components
          .filter((component) => component.categories.includes(current.name))
          .filter((component) => component.keywords.some((keyword) => keyword.includes(query)));

        return searchResults.length > 0 ? acc.concat({ category: current.name, components: searchResults }) : acc;
      }, [] as CategoryComponents[])
    : null;

  useEffect(() => {
    const unlisten = history.listen(() => {
      setModalVisible(false);
      setOverlayVisible(false);
    });

    return unlisten;
  }, []);

  return (
    <>
      {mobileOnly && (
        <>
          <S.SearchIcon onClick={() => setModalVisible(true)} />
          <S.SearchModal
            visible={isModalVisible}
            closable={false}
            footer={null}
            onCancel={() => setModalVisible(false)}
            destroyOnClose
          >
            <SearchDropdown
              query={query}
              setQuery={setQuery}
              data={sortedResults}
              isOverlayVisible={isOverlayVisible}
              setOverlayVisible={setOverlayVisible}
            />
          </S.SearchModal>
        </>
      )}

      {isTablet && (
        <SearchDropdown
          query={query}
          setQuery={setQuery}
          data={sortedResults}
          isOverlayVisible={isOverlayVisible}
          setOverlayVisible={setOverlayVisible}
        />
      )}
    </>
  );
};