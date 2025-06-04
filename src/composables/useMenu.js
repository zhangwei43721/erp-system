import { computed, markRaw, onMounted, ref, shallowRef } from 'vue'
import { appApi } from '@/api/app'
import emitter from '@/eventBus'

export default function useMenu() {
  const menus = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const activeMenuId = ref(null)
  
  const hasMenus = computed(() => menus.value?.length > 0)
  
  // 默认展开所有菜单项
  const defaultOpeneds = computed(() => {
    return menus.value.map(menu => menu.id.toString())
  })
  
  // 查找菜单项
  const findMenuById = (id) => {
    if (!id || !menus.value) return null
    for (const menu of menus.value) {
      if (menu.subMenu) {
        for (const sub of menu.subMenu) {
          if (sub.id.toString() === id) return sub
        }
      }
    }
    return null
  }
  
  // 获取第一个可用的子菜单ID
  const getFirstAvailableSubMenuId = () => {
    if (menus.value?.length > 0) {
      for (const menu of menus.value) {
        if (menu.subMenu?.length > 0 && menu.subMenu[0].id != null) {
          return menu.subMenu[0].id.toString()
        }
      }
    }
    return null
  }
  
  // 获取菜单数据
  const fetchMenus = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await appApi.getMenus()
      menus.value = response.data
    } catch (err) {
      console.error('菜单加载失败:', err)
      error.value = '菜单加载失败，请刷新页面重试'
      menus.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  // 菜单结构变化处理
  const handleMenuStructureChanged = () => {
    fetchMenus()
  }
  
  // 初始化菜单
  const initializeMenu = async () => {
    await fetchMenus()
    
    let initialMenuId = null
    const savedMenuId = localStorage.getItem('selectedMenuId')
    
    if (menus.value?.length > 0) {
      if (savedMenuId && findMenuById(savedMenuId)) {
        initialMenuId = savedMenuId
      } else {
        localStorage.removeItem('selectedMenuId')
        initialMenuId = getFirstAvailableSubMenuId()
      }
    }
    
    activeMenuId.value = initialMenuId
    return initialMenuId
  }
  
  // 设置活动菜单
  const setActiveMenu = (id) => {
    activeMenuId.value = id
    localStorage.setItem('selectedMenuId', id)
  }
  
  // 组件挂载时设置事件监听
  onMounted(() => {
    emitter.on('menu-structure-changed', handleMenuStructureChanged)
    
    // 5秒后自动清除错误信息
    const errorTimer = setInterval(() => {
      if (error.value) error.value = null
    }, 5000)
    
    return () => {
      emitter.off('menu-structure-changed', handleMenuStructureChanged)
      clearInterval(errorTimer)
    }
  })
  
  return {
    menus,
    isLoading,
    error,
    activeMenuId,
    hasMenus,
    defaultOpeneds,
    fetchMenus,
    setActiveMenu,
    initializeMenu
  }
}